package com.api.e_commerce.service;

import com.api.e_commerce.dto.CategoryCreateDTO;
import com.api.e_commerce.dto.CategoryDTO;
import com.api.e_commerce.exception.DuplicateEntityException;
import com.api.e_commerce.exception.ResourceNotFoundException;
import com.api.e_commerce.model.Category;
import com.api.e_commerce.model.Product;
import com.api.e_commerce.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryDTO createCategory(CategoryCreateDTO dto) {
        if (categoryRepository.existsByNombre(dto.getNombre())) {
            throw new DuplicateEntityException("Categoría", "nombre", dto.getNombre());
        }

        Category category = new Category();
        category.setDescripcion(dto.getDescripcion());
        category.setNombre(dto.getNombre());

        Category saved = categoryRepository.save(category);
        return convertToDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryDTO getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría", id));
        return convertToDTO(category);
    }

    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Categoría", id);
        }
        categoryRepository.deleteById(id);
    }

    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setNombre(category.getNombre());
        dto.setDescripcion(category.getDescripcion());
        return dto;
    }
}
