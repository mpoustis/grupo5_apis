package com.api.e_commerce.dto;

import lombok.Data;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

@Data
public class ProductoCreateDTO {
    private String nombre;
    private String descripcion;
    private Double precio;
    private Integer stock;
    private Long ownerId;
    private Long categoriaId;
    public List<String> images;
}
