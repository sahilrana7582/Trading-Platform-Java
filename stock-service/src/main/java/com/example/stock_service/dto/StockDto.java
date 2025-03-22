package com.example.stock_service.dto;


import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StockDto {

    private String stockName;
    private BigDecimal stockPrice;
    private String category;
    private String symbol;


}
