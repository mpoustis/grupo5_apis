package com.api.e_commerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.api.e_commerce.dto.CreateOrderDTO;
import com.api.e_commerce.dto.OrderDTO;
import com.api.e_commerce.service.OrderService;

@RestController
@RequestMapping("/api/orders") // localhost:8080/api/orders
public class OrderController {

    @Autowired
    private OrderService orderService;

    // GET: obtener todas las órdenes
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<OrderDTO> orders = orderService.getAllOrders();
        return ResponseEntity.ok(orders);
    }

    // GET: obtener una orden por ID
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        OrderDTO createdOrder = orderService.getOrderById(id);
        return ResponseEntity.ok(createdOrder);
    }

    // POST: crear una nueva orden con sus items
    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@RequestBody CreateOrderDTO createOrderDTO) {
        OrderDTO createdOrder = orderService.createOrder(createOrderDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
    }

    // PUT/PATCH: actualizar el estado de una orden
    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        OrderDTO updatedOrder = orderService.updateOrderStatus(id, status);
        return ResponseEntity.ok(updatedOrder);
    }

    // DELETE: eliminar una orden
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
