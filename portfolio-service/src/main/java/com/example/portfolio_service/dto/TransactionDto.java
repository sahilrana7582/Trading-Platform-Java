package com.example.portfolio_service.dto;


import com.example.portfolio_service.type.TransactionType;
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
public class TransactionDto {
    private Long id;
    private Long orderId;
    private TransactionType type;
    private String symbol;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal amount;
    private LocalDateTime timestamp;
}