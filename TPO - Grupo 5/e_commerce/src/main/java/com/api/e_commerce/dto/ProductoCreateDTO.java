package com.api.e_commerce.dto;

import java.util.List;

import lombok.Data;

@Data
public class ProductoCreateDTO {
    private String nombre;
    private double precio;
    private int stock;
    private String descripcion;
    private Long ownerId;
    private List<Long> categoriaIds;
    private List<String> images;
}
