package com.example.order_service.controller;


import com.example.order_service.dto.OrderDto;
import com.example.order_service.dto.OrderWithPositionsDto;
import com.example.order_service.service.OrderService;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping(path = "/api/order", produces = {MediaType.APPLICATION_JSON_VALUE})
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/place/{userId}")
    public ResponseEntity<String> placeOrder(@RequestBody OrderDto orderDto, @PathVariable("userId") String userId) throws JsonProcessingException {
        orderService.placeOrder(orderDto.getStockSymbol(), orderDto.getQuantity(), orderDto.getOrderType(), userId, null);
        return ResponseEntity.ok("Order placed successfully");
    }

    @PostMapping("/sell/{userId}/{positionId}")
    public ResponseEntity<String> sellOrder(@RequestBody OrderDto orderDto, @PathVariable("userId") String userId, @PathVariable("positionId") Long positionId) throws JsonProcessingException {
        orderService.placeOrder(orderDto.getStockSymbol(), orderDto.getQuantity(), orderDto.getOrderType(), userId, positionId);
        return ResponseEntity.ok("Order closed successfully");
    }


    @GetMapping("/user/position/{orderId}")
    public ResponseEntity<OrderWithPositionsDto> getOrdersByPortfolioId(@PathVariable("orderId") String orderId) {
        OrderWithPositionsDto orders = orderService.getOrderWithPositions(orderId);
        return ResponseEntity.ok(orders);
    }


    @GetMapping("/load")
    public ResponseEntity<String> checkLoad(HttpServletRequest request) {
        String fullUrl = request.getRequestURL().toString();
        String queryString = request.getQueryString();

        if (queryString != null) {
            fullUrl += "?" + queryString;
        }

        System.out.println("Full URL: " + fullUrl);
        return ResponseEntity.ok(fullUrl);
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<List<OrderDto>> getOrdersByUserId(@PathVariable("userId") String userId)
    {
        List<OrderDto> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }
}
