package com.example.api_gateway.config;


import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {
    @Bean
    public RouteLocator customRouteLocater(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("order-service", r -> r.path("/api/order/**")
                        .uri("lb://order-service"))
                .build();
    }
}
