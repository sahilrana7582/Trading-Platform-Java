package com.example.user_service.controller;


import com.example.user_service.dto.UserDto;
import com.example.user_service.dto.UserWithOrderDto;
import com.example.user_service.dto.UserWithPortfolio;
import com.example.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RequestMapping("/api/users")
@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/orders/{userId}")
    public UserWithOrderDto getUsersWithOrders(@PathVariable String userId) {
        return userService.getUserWithOrders(userId);
    }

    @PostMapping("/create")
    public ResponseEntity<String> createNewUser(@RequestBody UserDto dto) {
        userService.createNewUser(dto);
        return ResponseEntity.ok("User created successfully");
    }

    @GetMapping("/portfolio/{userId}")
    public UserWithPortfolio getUserWithPortfolio(@PathVariable String userId) {
        return userService.getUserWithPortfolio(userId);
    }
}
