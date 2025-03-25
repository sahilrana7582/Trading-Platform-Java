package com.example.order_service.service;


import com.example.order_service.dto.OrderDto;
import com.example.order_service.dto.OrderWithPositionsDto;
import com.example.order_service.dto.PositionDto;
import com.example.order_service.entity.Order;
import com.example.order_service.repository.OrderRepository;
import com.example.order_service.service.foreignService.PositionService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private final ObjectMapper objectMapper;

    @Autowired
    private final PositionService positionService;

    private final Map<String, BigDecimal> lastestStockPrices= new ConcurrentHashMap<>();

    @Value("${kafka.topic.order-events}")
    private String orderEventsTopic;


    @KafkaListener(topics = "${kafka.topic.stock-price-updates}", groupId = "order-service-group")
    public void consumeStockPriceUpdates(String eventMessage) {
        try {
            JsonNode jsonNode = objectMapper.readTree(eventMessage);
            String stockSymbol = jsonNode.get("symbol").asText();
            BigDecimal stockPrice = new BigDecimal(jsonNode.get("price").asText());
            lastestStockPrices.put(stockSymbol, stockPrice);
            log.info("Received stock price update event for symbol: {}, price: {}", stockSymbol, stockPrice);
        } catch (Exception e) {
            log.error("Error processing stock price update event: {}", e.getMessage());
        }
    }

    @Transactional
    public void placeOrder(String stockSymbol, Integer quantity, String orderType, String userId, Long positionId) throws JsonProcessingException {


        BigDecimal stockPrice = lastestStockPrices.getOrDefault(stockSymbol, BigDecimal.TEN);
        BigDecimal totalCost = stockPrice.multiply(BigDecimal.valueOf(quantity));

        String orderStatus = positionId != null ? "CLOSED" : "OPEN";
        Order newOrder = new Order();
        newOrder.setOrderType(orderType);
        newOrder.setStockSymbol(stockSymbol);
        newOrder.setQuantity(quantity);
        newOrder.setPrice(totalCost);
        newOrder.setUserId(userId);
        newOrder.setPositionId(positionId);
        newOrder.setStatus(orderStatus);
        Order order = orderRepository.save(newOrder);
        newOrder.setId(order.getId());
        publishOrderEvent(newOrder);
    }

    private void publishOrderEvent(Order order) throws JsonProcessingException {

        String orderMessage = objectMapper.writeValueAsString(order);
        CompletableFuture<SendResult<String, String>> future = kafkaTemplate.send(orderEventsTopic, orderMessage);

        future.whenComplete((result, ex) -> {
            if (ex != null) {
                System.err.println("Failed to send message: " + ex.getMessage());
            } else {
                System.out.println("Message sent successfully: " +
                        result.getProducerRecord().value() +
                        " to partition " + result.getRecordMetadata().partition() +
                        " with offset " + result.getRecordMetadata().offset());
            }
        });
    }

    public List<OrderDto> getOrdersByUserId(String userId) {
        List<Order> orders = orderRepository.findByUserId(userId);


        List<OrderDto> orderDtos = orders.stream().map(order -> new OrderDto(
                order.getId(),
                order.getStockSymbol(),
                order.getQuantity(),
                order.getOrderType(),
                order.getPrice()
        )).collect(Collectors.toList());

        return orderDtos;

    }

    public OrderWithPositionsDto getOrderWithPositions(String orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);

        if (order == null) {
            return null;
        }



        OrderWithPositionsDto orderWithPositionsDto = new OrderWithPositionsDto();
        orderWithPositionsDto.setOrder(new OrderDto(order.getId(),order.getStockSymbol(), order.getQuantity(), order.getOrderType(), order.getPrice()));

        PositionDto positionDto = positionService.getPosition(orderId);
        orderWithPositionsDto.setPosition(positionDto);

        return orderWithPositionsDto;
    }


}
