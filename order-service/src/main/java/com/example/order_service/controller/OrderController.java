package com.example.order_service.controller;


import com.example.order_service.dto.OrderDto;
import com.example.order_service.service.OrderService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.WebRequest;

import java.math.BigDecimal;

@RestController
@RequestMapping(path = "/api/order", produces = {MediaType.APPLICATION_JSON_VALUE})
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<String> placeOrder(@RequestBody OrderDto orderDto){
        orderService.placeOrder(orderDto.getStockSymbol(), orderDto.getQuantity(), orderDto.getOrderType());
        return ResponseEntity.ok("Order placed successfully");
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
}
