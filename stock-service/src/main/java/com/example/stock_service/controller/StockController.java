package com.example.stock_service.controller;


import com.example.stock_service.dto.ResponseDto;
import com.example.stock_service.dto.StockDto;
import com.example.stock_service.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/stock", produces = {MediaType.APPLICATION_JSON_VALUE})
public class StockController {

    @Autowired
    private StockService stockService;

    @PostMapping("/create")
    public ResponseEntity<ResponseDto> createNewStock(@RequestBody StockDto stockDto){
        stockService.addStock(stockDto);
        return ResponseEntity.ok(new ResponseDto(HttpStatus.OK, "Stock created successfully"));
    }

    @PostMapping("/send")
    public ResponseEntity<ResponseDto> sendStockToKafka(){
        stockService.sendStockToKafka();
        return ResponseEntity.ok(new ResponseDto(HttpStatus.OK, "Stock sent to kafka successfully"));
    }


}
