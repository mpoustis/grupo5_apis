package com.api.e_commerce.dto;

import java.util.List;

public class OrderDTO {
    private Long id;
    private Long buyerId;
    private String status;
    private Double totalAmount;
    private List<OrderItemDetailDTO> items;

    // Getters y setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public Long getBuyerId() {
        return buyerId;
    }
    public void setBuyerId(Long buyerId) {
        this.buyerId = buyerId;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }
    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public List<OrderItemDetailDTO> getItems() {
        return items;
    }
    public void setItems(List<OrderItemDetailDTO> items) {
        this.items = items;
    }
}
