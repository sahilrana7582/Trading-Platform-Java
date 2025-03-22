package com.example.stock_service.dto;


import lombok.*;
import org.springframework.http.HttpStatus;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter

public class ErrorResponseDto {

    private String apiPath;
    private HttpStatus statusCode;
    private String message;

}
