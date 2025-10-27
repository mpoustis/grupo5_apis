package com.api.e_commerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.e_commerce.model.Category;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findAllById(Iterable<Long> ids);}
