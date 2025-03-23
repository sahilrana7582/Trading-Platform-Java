package com.example.order_service.repository;

import com.example.order_service.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByUserId(String userId);
}
