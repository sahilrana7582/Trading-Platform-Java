package com.example.order_service.dto;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderEvent {

    private String id;

    private String stockSymbol;

    private Integer quantity;

    private String orderType;

    private BigDecimal price;

    private Long positionId;

    private Long portfolioId;

}