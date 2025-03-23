package com.example.user_service.controller;


import com.example.user_service.dto.UserDto;
import com.example.user_service.dto.UserWithOrderDto;
import com.example.user_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
