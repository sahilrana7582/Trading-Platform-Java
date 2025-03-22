package com.example.stock_service.dto;

import lombok.*;
import org.springframework.http.HttpStatus;


@Getter
@Setter
@AllArgsConstructor // Generates a constructor with all fields
@NoArgsConstructor  // Generates a no-argument constructor
public class ResponseDto {
    private HttpStatus httpStatus;
    private String message;
}
