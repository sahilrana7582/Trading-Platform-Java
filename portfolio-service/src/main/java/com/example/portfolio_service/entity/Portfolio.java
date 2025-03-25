package com.example.portfolio_service.entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "portfolio")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "cash_balance", nullable = false)
    private BigDecimal cashBalance;

    @Column(nullable = false)
    private BigDecimal totalInvestment;

    @Column(nullable = false)
    private BigDecimal currentValue;

    @Column(nullable = false)
    private BigDecimal profitLoss;


    @OneToMany(mappedBy = "portfolio", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Position> positions = new ArrayList<>();
}
