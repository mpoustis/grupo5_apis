package com.api.e_commerce.dto;

import java.util.List;

public class CreateOrderDTO {
    private Long buyerId;
    private List<OrderItemDTO> items;

    public Long getBuyerId() {
        return buyerId;
    }
    public void setBuyerId(Long buyerId) {
        this.buyerId = buyerId;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }
    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }
}

