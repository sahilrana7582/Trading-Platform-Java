package com.example.order_service.service.foreignService;


import com.example.order_service.dto.PositionDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@Service
@FeignClient(name = "portfolio-service", url = "http://localhost:8084/api/v1/portfolios")
public interface PositionService {

    @GetMapping("/positions/{orderId}")
    PositionDto getPosition(@PathVariable String orderId);
}
