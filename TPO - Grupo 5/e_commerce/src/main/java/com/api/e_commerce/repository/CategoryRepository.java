package com.api.e_commerce.repository;

import com.api.e_commerce.model.Category;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByNombre(String nombre);
    Optional<Category> findByNombre(String nombre);
}
