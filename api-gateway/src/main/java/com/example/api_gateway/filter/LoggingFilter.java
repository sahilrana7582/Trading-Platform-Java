package com.example.api_gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Instant;


@Component
public class LoggingFilter implements GlobalFilter {

    private static final Logger logger = LoggerFactory.getLogger(LoggingFilter.class);


    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        logger.info("Request received: {} {}",
                exchange.getRequest().getMethod(),
                exchange.getRequest().getURI().getPath());

        long startTime = Instant.now().toEpochMilli();
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            long endTime = Instant.now().toEpochMilli();
            logger.info("Request completed in {}ms with status {}",
                    (endTime - startTime),
                    exchange.getResponse().getStatusCode());
        }));
    }
}
