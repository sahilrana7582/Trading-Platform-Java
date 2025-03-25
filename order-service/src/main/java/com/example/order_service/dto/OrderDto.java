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
public class OrderDto {

    private String id;
    private String stockSymbol;
    private Integer quantity;
    private String orderType;
    private BigDecimal price;
}
