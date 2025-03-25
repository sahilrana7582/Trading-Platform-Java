package com.example.stock_service.service;


import com.example.stock_service.dto.StockDto;
import com.example.stock_service.entity.Stock;
import com.example.stock_service.mapper.StockMapper;
import com.example.stock_service.repository.StockRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;
import java.util.concurrent.CompletableFuture;

@Service
@RequiredArgsConstructor
@Slf4j
public class StockService {

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private final SimpMessagingTemplate messagingTemplate;





    public void addStock(StockDto stockDto) {
        Stock stock = StockMapper.toStock(stockDto, new Stock());
        stockRepository.save(stock);
    }

    public void sendStockToKafka() {
        kafkaTemplate.send("stock-topic", "Hello World");
    }

    @Scheduled(fixedRate = 2000)
    @Transactional
    public void generatePriceUpdates() {
        List<Stock> stocks = stockRepository.findAll();
        Random random = new Random();

        for (Stock stock : stocks) {
            // Generate a random change between -2 and +2 points
            double fixedChange = (random.nextDouble() * 4) - 2;
            BigDecimal changeAmount = BigDecimal.valueOf(fixedChange);
            BigDecimal newPrice = stock.getStockPrice().add(changeAmount);

            // Ensure the new price does not fall below zero
            if (newPrice.compareTo(BigDecimal.ZERO) < 0) {
                newPrice = BigDecimal.ZERO;
            }
            stock.setStockPrice(newPrice);

            // Create the update message
            String message = String.format("{\"Stock Name\": \"%s\", \"symbol\": \"%s\", \"price\": \"%s\"}",
                    stock.getStockName(), stock.getSymbol(), stock.getStockPrice().toString());

            // Send update to Kafka
            CompletableFuture<SendResult<String, String>> future = kafkaTemplate.send("stock_price_updates", message);
            future.thenAccept(result -> {
                log.info("Event sent successfully to topic: {}, partition: {}, offset: {}",
                        result.getRecordMetadata().topic(),
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
            }).exceptionally(ex -> {
                log.error("Failed to send event to Kafka", ex);
                return null;
            });

            // Send update to WebSocket
            messagingTemplate.convertAndSend("/topic/stock-updates", message);
            log.info("Sent stock update to WebSocket: {}", message);
        }

        // Save all updated stocks
        stockRepository.saveAll(stocks);
    }


}
