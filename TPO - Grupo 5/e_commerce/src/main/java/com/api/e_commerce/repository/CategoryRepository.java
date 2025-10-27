package com.api.e_commerce.repository;

import com.api.e_commerce.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    List<Category> findAllById(Iterable<Long> ids);}
