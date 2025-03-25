package com.example.order_service.entity;


import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Table(name = "order_table")
@Setter
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column
    private String userId;

    @Column
    private String stockSymbol;

    private Integer quantity;

    private String orderType;

    private BigDecimal price;

    private Long positionId;

    private Long portfolioId;

    private String status;

}
