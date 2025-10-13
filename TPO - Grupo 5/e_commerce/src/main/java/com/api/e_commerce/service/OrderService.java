package com.api.e_commerce.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.api.e_commerce.dto.CreateOrderDTO;
import com.api.e_commerce.dto.OrderDTO;
import com.api.e_commerce.dto.OrderItemDTO;
import com.api.e_commerce.dto.OrderItemDetailDTO;
import com.api.e_commerce.model.Order;
import com.api.e_commerce.model.OrderItem;
import com.api.e_commerce.model.Producto;
import com.api.e_commerce.model.Usuario;
import com.api.e_commerce.repository.OrderItemRepository;
import com.api.e_commerce.repository.OrderRepository;
import com.api.e_commerce.repository.ProductoRepository;
import com.api.e_commerce.repository.UsuarioRepository;

@Service
@Transactional
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Obtener todas las órdenes
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    // Obtener una orden por ID
    public OrderDTO getOrderById(Long id) {
        return orderRepository.findById(id)
            .map(this::convertToDTO)
            .orElse(null);
    }

    // Crear una orden con sus ítems
    public OrderDTO createOrder(CreateOrderDTO createOrderDTO) {
        Usuario buyer = usuarioRepository.findById(createOrderDTO.getBuyerId())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Order order = new Order();
        order.setBuyer(buyer);
        order.setStatus("pending");

        // Mapeo de ítems y cálculo del total
        List<OrderItem> items = createOrderDTO.getItems().stream().map(itemDTO -> {
            Producto product = productoRepository.findById(itemDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con id: " + itemDTO.getProductId()));

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemDTO.getQuantity());
            item.setUnitPrice(product.getPrecio());
            return item;
        }).collect(Collectors.toList());

        // calcular totalAmount
        double totalAmount = items.stream().mapToDouble(item -> item.getUnitPrice() * item.getQuantity()).sum();

        order.setTotalAmount(totalAmount);
        order.setItems(items);

        // Persistimos la orden con sus ítems
        orderRepository.save(order);
        orderItemRepository.saveAll(items);

        return convertToDTO(order);
    }

    // Actualizar el estado de una orden
    public OrderDTO updateOrderStatus(Long id, String status) {
        return orderRepository.findById(id)
            .map(order -> {
                order.setStatus(status);
                orderRepository.save(order);
                return convertToDTO(order);
            })
            .orElse(null);
    }

    // Eliminar una orden
    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    // -----------------------------
    // MÉTODOS PRIVADOS AUXILIARES
    // -----------------------------

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setBuyerId(order.getBuyer().getId());
        dto.setStatus(order.getStatus());
        dto.setTotalAmount(order.getTotalAmount());

        List<OrderItemDetailDTO> itemDTOs = order.getItems().stream().map(item -> {
            OrderItemDetailDTO i = new OrderItemDetailDTO();
            i.setProductId(item.getProduct().getId());
            i.setProductName(item.getProduct().getNombre());
            i.setQuantity(item.getQuantity());
            i.setUnitPrice(item.getUnitPrice());
            return i;
        }).collect(Collectors.toList());

        dto.setItems(itemDTOs);
        return dto;
    }
}
