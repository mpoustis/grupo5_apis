package com.api.e_commerce.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProductoDTO {
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private Long ownerId;
    private List<Long> categoriaIds;
    public List<String> images;

}