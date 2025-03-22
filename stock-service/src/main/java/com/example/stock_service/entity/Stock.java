package com.example.stock_service.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "stock_name", nullable = false)
    private String stockName;

    @Column(name = "stock_price", nullable = false)
    private double stockPrice;

}
