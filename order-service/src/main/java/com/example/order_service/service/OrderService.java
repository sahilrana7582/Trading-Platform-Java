package com.example.order_service.service;


import com.example.order_service.entity.Order;
import com.example.order_service.repository.OrderRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

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
    public void placeOrder(String stockSymbol, Integer quantity, String orderType) {
        BigDecimal stockPrice = lastestStockPrices.getOrDefault(stockSymbol, BigDecimal.ZERO);
        BigDecimal totalCost = stockPrice.multiply(BigDecimal.valueOf(quantity));
        Order newOrder = new Order();
        newOrder.setOrderType(orderType);
        newOrder.setStockSymbol(stockSymbol);
        newOrder.setQuantity(quantity);
        newOrder.setPrice(totalCost);
        orderRepository.save(newOrder);
        publishOrderEvent(newOrder);
    }

    private void publishOrderEvent(Order order) {
        String orderMessage = String.format("{\"orderType\": \"%s\", \"stockSymbol\": \"%s\", \"quantity\": %d, \"price\": %s}", order.getOrderType(), order.getStockSymbol(), order.getQuantity(), order.getPrice());
        kafkaTemplate.send(orderEventsTopic, orderMessage);
    }


}
