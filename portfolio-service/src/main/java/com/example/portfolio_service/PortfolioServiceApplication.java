package com.example.portfolio_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient
public class PortfolioServiceApplication {



	public static void main(String[] args) {
		SpringApplication.run(PortfolioServiceApplication.class, args);
	}

}
