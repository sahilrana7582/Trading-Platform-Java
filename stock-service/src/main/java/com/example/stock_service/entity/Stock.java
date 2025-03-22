package com.example.stock_service.entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "stock_name", nullable = false)
    private String stockName;

    @Column(name = "stock_price", nullable = false)
    private BigDecimal stockPrice;

    @Column(name = "category", nullable = false)
    private String category;

    @Column(name = "symbol", nullable = false)
    private String symbol;


}
