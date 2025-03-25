package com.example.order_service.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
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
