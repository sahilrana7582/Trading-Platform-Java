package com.example.portfolio_service.entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "positions")
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class Position {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;

    @Column(nullable = false)
    private String symbol;

    @Column(nullable = false)
    private Integer quantity;

    @Column
    private BigDecimal boughtAt;


    @Column(nullable = false)
    private BigDecimal currentPrice;

    @Column(nullable = false)
    private BigDecimal investmentValue;

    @Column(nullable = false)
    private BigDecimal currentValue;

    @Column(nullable = false)
    private BigDecimal profitLoss;

    @Column(nullable = false)
    private BigDecimal profitLossPercentage;

    @Column
    private String orderId;

}
