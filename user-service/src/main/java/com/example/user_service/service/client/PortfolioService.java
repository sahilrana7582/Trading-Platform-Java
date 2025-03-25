package com.example.user_service.service.client;


import com.example.user_service.dto.PortfolioResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "portfolio-service", url = "http://localhost:8084/api/v1/portfolios")
public interface PortfolioService {

    @GetMapping("/{userId}")
    public PortfolioResponse getPortfolioByUserId(@PathVariable String userId);
}
