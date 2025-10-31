package com.api.e_commerce.dto;

import lombok.Data;
import java.util.List;

import jakarta.persistence.criteria.CriteriaBuilder.In;

@Data
public class ProductoDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private Long ownerId;
    private Long categoriaId;
    public List<String> images;

}