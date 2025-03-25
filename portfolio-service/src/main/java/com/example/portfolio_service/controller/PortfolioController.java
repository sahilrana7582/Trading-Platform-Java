package com.example.portfolio_service.controller;

import com.example.portfolio_service.dto.PortfolioResponse;
import com.example.portfolio_service.dto.PositionDto;
import com.example.portfolio_service.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/portfolios")
@RequiredArgsConstructor
public class PortfolioController {


    @Autowired
    private final PortfolioService portfolioService;

    @GetMapping("/{userId}")
    public ResponseEntity<PortfolioResponse> getPortfolio(@PathVariable String userId) {
        return ResponseEntity.ok(portfolioService.getPortfolio(userId));
    }

    @GetMapping("/positions/{orderId}")
    public ResponseEntity<PositionDto> getPosition(@PathVariable String orderId) {
        return ResponseEntity.ok(portfolioService.getPosition(orderId));
    }

    @PostMapping("/{userId}/deposit")
    public ResponseEntity<Void> depositFunds(
            @PathVariable String userId,
            @RequestParam BigDecimal amount) {
        portfolioService.depositFunds(userId, amount);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{userId}/withdraw")
    public ResponseEntity<Void> withdrawFunds(
            @PathVariable String userId,
            @RequestParam BigDecimal amount) {
        portfolioService.withdrawFunds(userId, amount);
        return ResponseEntity.ok().build();
    }
}