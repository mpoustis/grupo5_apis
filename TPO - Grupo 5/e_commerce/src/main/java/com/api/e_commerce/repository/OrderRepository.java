package com.api.e_commerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.api.e_commerce.model.Order;

// CRUD completo heredado de JpaRepository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByBuyerId(Long buyerId);
    List<Order> findByStatus(String status);
}
