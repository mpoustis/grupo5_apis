package com.api.e_commerce.repository;

import com.api.e_commerce.model.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImagenProductoRepository extends JpaRepository<Image, Long> {
    List<Image> findByProductoId(Long productoId);
    void deleteByProductoId(Long productoId);
}
