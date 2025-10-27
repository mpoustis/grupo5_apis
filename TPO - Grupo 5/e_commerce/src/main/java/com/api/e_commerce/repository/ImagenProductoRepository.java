package com.api.e_commerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.e_commerce.model.Image;

public interface ImagenProductoRepository extends JpaRepository<Image, Long> {
    List<Image> findByProductoId(Long productoId);
    void deleteByProductoId(Long productoId);
}
