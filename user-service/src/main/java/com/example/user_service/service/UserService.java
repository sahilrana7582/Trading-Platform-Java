package com.example.user_service.service;


import com.example.user_service.dto.OrderDto;
import com.example.user_service.dto.UserDto;
import com.example.user_service.dto.UserWithOrderDto;
import com.example.user_service.entity.User;
import com.example.user_service.repository.UserRepository;
import com.example.user_service.service.client.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    public void createNewUser(UserDto dto) {
        User newUser = new User();
        newUser.setName(dto.getName());
        newUser.setEmail(dto.getEmail());
        userRepository.save(newUser);
    }

    public UserWithOrderDto getUserWithOrders(String userId) {
        User user = userRepository.findById(userId).get();
        UserWithOrderDto userWithOrderDto = new UserWithOrderDto();
        userWithOrderDto.setUser(new UserDto(user.getName(), user.getEmail()));

        List<OrderDto> orders = orderService.getOrdersByUserId(userId);

        userWithOrderDto.setOrder(orders);

        return userWithOrderDto;
    }
}
