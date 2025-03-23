package com.example.user_service.service.client;


import com.example.user_service.dto.OrderDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;


@FeignClient(name = "api-gateway", url = "http://localhost:8080/api/order")
public interface OrderService {


    @GetMapping("/users/{userId}")
    public List<OrderDto> getOrdersByUserId(@PathVariable("userId") String userId);
}
