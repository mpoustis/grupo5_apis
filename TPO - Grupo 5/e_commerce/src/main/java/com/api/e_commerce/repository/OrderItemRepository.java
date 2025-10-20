package com.api.e_commerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.api.e_commerce.model.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    List<OrderItem> findByOrderId(Long orderId);
    List<OrderItem> findByProductId(Long productId);
}
