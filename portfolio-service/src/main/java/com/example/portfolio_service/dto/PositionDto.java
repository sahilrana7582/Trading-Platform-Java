package com.example.portfolio_service.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PositionDto {

    private String symbol;
    private Integer quantity;
    private BigDecimal boughtAt;
    private BigDecimal currentPrice;
    private BigDecimal investmentValue;
    private BigDecimal currentValue;
    private BigDecimal profitLoss;
    private BigDecimal profitLossPercentage;


}