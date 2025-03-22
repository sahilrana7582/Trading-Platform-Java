package com.example.stock_service.mapper;

import com.example.stock_service.dto.StockDto;
import com.example.stock_service.entity.Stock;



public class StockMapper {

    public static Stock toStock(StockDto stockDto, Stock stock) {
        stock.setStockName(stockDto.getStockName());
        stock.setStockPrice(stockDto.getStockPrice());
        stock.setCategory(stockDto.getCategory());
        stock.setSymbol(stockDto.getSymbol());
        return stock;
    }

    public static StockDto toStockDto(Stock stock) {
        StockDto stockDto = new StockDto();
        stockDto.setStockName(stock.getStockName());
        stockDto.setStockPrice(stock.getStockPrice());
        stockDto.setCategory(stock.getCategory());
        stockDto.setSymbol(stock.getSymbol());
        return stockDto;
    }
}
