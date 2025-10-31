package com.api.e_commerce.service;

import java.util.Comparator;
import java.util.List;
import com.api.e_commerce.exception.*;

import com.api.e_commerce.dto.*;
import com.api.e_commerce.model.Category;
import com.api.e_commerce.model.Image;
import com.api.e_commerce.repository.CategoryRepository;
import com.api.e_commerce.repository.ImagenProductoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.api.e_commerce.model.Product;
import com.api.e_commerce.model.User;
import com.api.e_commerce.repository.ProductoRepository;

@Service
@Transactional
@AllArgsConstructor
public class ProductoService {

    private ProductoRepository productoRepository;
    private UsuarioService usuarioService;
    private ImagenService imagenService;
    private ImagenProductoRepository imagenProductoRepository;
    private CategoryRepository categoryRepository;

    @Transactional
    public ProductoDTO createProducto(ProductoCreateDTO dto) {
        // Validar precio
        if (dto.getPrecio() <= 0) {
            throw new InvalidPriceException(dto.getPrecio());
        }

        // Validar stock inicial
        if (dto.getStock() < 0) {
            throw new InvalidDataException("El stock inicial no puede ser negativo");
        }

        User owner = usuarioService.getUserById(dto.getOwnerId());
        Category categoria = categoryRepository.findById(dto.getCategoriaId())
            .orElseThrow(() -> new ResourceNotFoundException("Categoría", dto.getCategoriaId()));

        Product producto = new Product();
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setStock(dto.getStock());
        producto.setCategoria(categoria);

        producto.setOwner(owner);

        Product productoGuardado = productoRepository.save(producto);

        if(dto.getImages() != null && !dto.getImages().isEmpty()){
            List<String> urlsImages = imagenService.guardarImagenes(dto.getImages(), productoGuardado.getId());

            for(int i = 0; i < urlsImages.size(); i++){
                Image image = new Image();
                image.setProducto(productoGuardado);
                image.setUrl(urlsImages.get(i));
                image.setPosition(i+1);

                imagenProductoRepository.save(image);
            }
        }
        return convertToDTO(productoGuardado);
    }

    public List<ProductoDTO> getAllProductos() {
        return productoRepository.findAll().stream()
                .map(product -> {
                    ProductoDTO dto = new ProductoDTO();
                    dto.setId(product.getId());
                    dto.setNombre(product.getNombre());
                    dto.setDescripcion(product.getDescripcion());
                    dto.setPrecio(product.getPrecio());
                    dto.setStock(product.getStock());
                    dto.setOwnerId(product.getOwner().getId());
                    dto.setCategoriaId(product.getCategoria().getId());
                    return dto;
                })
                .toList();
    }

    public ProductoDTO getProductoById(Long id) {
        return productoRepository.findById(id)
                .map(product -> {
                    ProductoDTO dto = new ProductoDTO();
                    dto.setId(product.getId());
                    dto.setNombre(product.getNombre());
                    dto.setDescripcion(product.getDescripcion());
                    dto.setPrecio(product.getPrecio());
                    dto.setStock(product.getStock());
                    dto.setOwnerId(product.getOwner().getId());
                    dto.setCategoriaId(product.getCategoria().getId());
            
                    return dto;
                })
                .orElseThrow(() -> new ResourceNotFoundException("Producto", id));
    }

    public void deleteProducto(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Producto", id);
        }
        productoRepository.deleteById(id);
    }

    public ProductoDTO updateProducto(Long id, ProductoUpdateDTO productoDTO) {
        if (productoDTO.getPrecio() <= 0) {
            throw new InvalidPriceException(productoDTO.getPrecio());
        }

        if (productoDTO.getStock() < 0) {
            throw new InvalidDataException("El stock no puede ser negativo");
        }

        Product productoActualizado = productoRepository.findById(id)
            .map(producto -> {
                producto.setPrecio(productoDTO.getPrecio());
                producto.setStock(productoDTO.getStock());
                
                return productoRepository.save(producto);
            })
            .orElseThrow(() -> new ResourceNotFoundException("Producto", id));

        return convertToDTO(productoActualizado);
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> getProductosByOwner(Long ownerId) {
        List<Product> productos = productoRepository.findByOwnerId(ownerId);
        return productos.stream()
                .map(this::convertToDTO)
                .toList();
    }

    private ProductoDTO convertToDTO(Product producto) {
        ProductoDTO dto = new ProductoDTO();
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setDescripcion(producto.getDescripcion());
        dto.setPrecio(producto.getPrecio());
        dto.setStock(producto.getStock());
        dto.setOwnerId(producto.getOwner().getId());
        dto.setCategoriaId(producto.getCategoria().getId());
        return dto;
    }

    @Transactional(readOnly = true)
    public List<ProductoDTO> getProductosFiltrados(Long categoriaId, String sort) {
        List<Product> productos;

        // Determinar qué método usar según parámetros
        if (categoriaId != null) {
            productos = productoRepository.findByCategoriaId(categoriaId);
        } else {
            productos = productoRepository.findAll();
        }

        // Ordenar (solo en memoria, para mantenerlo simple)
        if ("asc".equalsIgnoreCase(sort)) {
            productos.sort(Comparator.comparing(Product::getPrecio));
        } else if ("desc".equalsIgnoreCase(sort)) {
            productos.sort(Comparator.comparing(Product::getPrecio).reversed());
        }

        return productos.stream()
                .map(this::convertToDTO)
                .toList();
    }
}
