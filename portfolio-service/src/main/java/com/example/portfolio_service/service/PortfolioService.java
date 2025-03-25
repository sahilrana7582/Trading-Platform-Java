package com.example.portfolio_service.service;


import com.example.portfolio_service.dto.PortfolioResponse;
import com.example.portfolio_service.dto.PositionDto;
import com.example.portfolio_service.entity.Portfolio;
import com.example.portfolio_service.entity.Position;
import com.example.portfolio_service.repository.PortfolioRepository;
import com.example.portfolio_service.repository.PositionRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PortfolioService {


    private final PortfolioRepository portfolioRepository;
    private final PositionRepository positionRepository;
    private final ObjectMapper objectMapper;


    @Transactional
    public PortfolioResponse getPortfolio(String userId) {
        Portfolio portfolio = portfolioRepository.findByUserId(userId)
                .orElseGet(() -> createNewPortfolio(userId));

        List<PositionDto> positions = portfolio.getPositions().stream()
                .map(this::mapToPositionDto)
                .collect(Collectors.toList());

        BigDecimal profitLossPercentage = calculateProfitLossPercentage(portfolio);

        return PortfolioResponse.builder()
                .userId(portfolio.getUserId())
                .cashBalance(portfolio.getCashBalance())
                .totalInvestment(portfolio.getTotalInvestment())
                .currentValue(portfolio.getCurrentValue())
                .profitLoss(portfolio.getProfitLoss())
                .profitLossPercentage(profitLossPercentage)
                .positions(positions)
                .build();
    }

    @Transactional
    public void depositFunds(String userId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Deposit amount must be positive");
        }

        Portfolio portfolio = portfolioRepository.findByUserId(userId)
                .orElseGet(() -> createNewPortfolio(userId));

        portfolio.setCashBalance(portfolio.getCashBalance().add(amount));
        portfolioRepository.save(portfolio);
    }

    @Transactional
    public void withdrawFunds(String userId, BigDecimal amount) {
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Withdrawal amount must be positive");
        }

        Portfolio portfolio = portfolioRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));

        if (portfolio.getCashBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient funds for withdrawal");
        }

        portfolio.setCashBalance(portfolio.getCashBalance().subtract(amount));
        portfolioRepository.save(portfolio);
    }

    private Portfolio createNewPortfolio(String userId) {
        Portfolio portfolio = Portfolio.builder()
                .userId(userId)
                .cashBalance(BigDecimal.ZERO)
                .totalInvestment(BigDecimal.ZERO)
                .currentValue(BigDecimal.ZERO)
                .profitLoss(BigDecimal.ZERO)
                .build();

        return portfolioRepository.save(portfolio);
    }

    private BigDecimal calculateProfitLossPercentage(Portfolio portfolio) {
        if (portfolio.getTotalInvestment().compareTo(BigDecimal.ZERO) > 0) {
            return portfolio.getProfitLoss()
                    .divide(portfolio.getTotalInvestment(), 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }
        return BigDecimal.ZERO;
    }
    @KafkaListener(topics = "${kafka.topic.order-events}", groupId = "portfolio-service-group")
    public void handleOrderEvent(String orderEventJson) {
        try {

            if (orderEventJson.startsWith("\"") && orderEventJson.endsWith("\"")) {
                orderEventJson = orderEventJson.substring(1, orderEventJson.length() - 1);
            }
            orderEventJson = orderEventJson.replace("\\\"", "\"");

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(orderEventJson);

            String userId = jsonNode.get("userId").asText();
            String stockSymbol = jsonNode.get("stockSymbol").asText();
            int quantity = jsonNode.get("quantity").asInt();
            double price = jsonNode.get("price").asDouble();
            String orderType = jsonNode.get("orderType").asText();
            String status = jsonNode.get("status").asText();
            String orderId = jsonNode.get("id").asText();


            Portfolio portfolio = portfolioRepository.findByUserId(userId)
                    .orElseGet(() -> createNewPortfolio(userId));


            Position position = Position.builder()
                    .symbol(stockSymbol)
                    .quantity(quantity)
                    .boughtAt(BigDecimal.valueOf(price))
                    .currentPrice(BigDecimal.valueOf(price))
                    .investmentValue(BigDecimal.valueOf(price * quantity))
                    .currentValue(BigDecimal.valueOf(price * quantity))
                    .profitLoss(BigDecimal.ZERO) // Initially zero
                    .profitLossPercentage(BigDecimal.ZERO)
                    .portfolio(portfolio)
                    .orderId(orderId)
                    .build();

            positionRepository.save(position);
            log.info("Order event processed successfully: {}", orderEventJson);

        } catch (Exception e) {
            log.error("Error processing order event: {}", orderEventJson, e);
        }
    }

    public PositionDto getPosition(String orderId) {
        Position position = positionRepository.getByOrderId(orderId).orElseThrow(() -> new RuntimeException("Position not found"));
        return mapToPositionDto(position);
    }

    private PositionDto mapToPositionDto(Position position) {
        return PositionDto.builder()
                .symbol(position.getSymbol())
                .quantity(position.getQuantity())
                .currentPrice(position.getCurrentPrice())
                .investmentValue(position.getInvestmentValue())
                .currentValue(position.getCurrentValue())
                .profitLoss(position.getProfitLoss())
                .profitLossPercentage(position.getProfitLossPercentage())
                .build();
    }




}
