package com.api.e_commerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
    public List<OrderDTO> getAllOrders() {
        return orderService.getAllOrders();
    }

    // GET: obtener una orden por ID
    @GetMapping("/{id}")
    public OrderDTO getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }

    // POST: crear una nueva orden con sus items
    @PostMapping
    public OrderDTO createOrder(@RequestBody CreateOrderDTO createOrderDTO) {
        return orderService.createOrder(createOrderDTO);
    }

    // PUT/PATCH: actualizar el estado de una orden
    @PatchMapping("/{id}/status")
    public OrderDTO updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        return orderService.updateOrderStatus(id, status);
    }

    // DELETE: eliminar una orden
    @DeleteMapping("/{id}")
    public void deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
    }
}
