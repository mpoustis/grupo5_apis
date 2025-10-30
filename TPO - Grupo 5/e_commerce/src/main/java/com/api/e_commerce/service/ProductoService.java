package com.api.e_commerce.service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.multipart.MultipartFile;
import com.api.e_commerce.exception.*;

import com.api.e_commerce.dto.*;
import com.api.e_commerce.model.Category;
import com.api.e_commerce.model.Image;
import com.api.e_commerce.repository.CategoryRepository;
import com.api.e_commerce.repository.ImagenProductoRepository;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<Product> createProducto(ProductoCreateDTO dto) {
        // Validar precio
        if (dto.getPrecio() <= 0) {
            throw new InvalidPriceException(dto.getPrecio());
        }

        // Validar stock inicial
        if (dto.getStock() < 0) {
            throw new InvalidDataException("El stock inicial no puede ser negativo");
        }

        User owner = usuarioService.getUserById(dto.getOwnerId());
        List<Category> categories = categoryRepository.findAllById(dto.getCategoriaIds());

        // // Validar que se encontraron todas las categorías
        // if (categories.size() != dto.getCategoriaIds().size()) {
        //     throw new ResourceNotFoundException("Una o más categorías no fueron encontradas");
        // }

        Product producto = new Product();
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setStock(dto.getStock());
        producto.setCategorias(categories);

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
        return new ResponseEntity<>(productoGuardado, HttpStatus.CREATED);
    }

    public List<ProductoDTO> getAllProductos() {
        return productoRepository.findAll().stream()
                .map(product -> {
                    ProductoDTO dto = new ProductoDTO();
                    dto.setNombre(product.getNombre());
                    dto.setDescripcion(product.getDescripcion());
                    dto.setPrecio(product.getPrecio());
                    dto.setStock(product.getStock());
                    dto.setOwnerId(product.getOwner().getId());
                    dto.setCategoriaIds(
                            product.getCategorias().stream()
                                    .map(Category::getId)
                                    .toList()
                    );
                    return dto;
                })
                .toList();
    }

    public ProductoDTO getProductoById(Long id) {
        return productoRepository.findById(id)
                .map(product -> {
                    ProductoDTO dto = new ProductoDTO();
                    dto.setNombre(product.getNombre());
                    dto.setDescripcion(product.getDescripcion());
                    dto.setPrecio(product.getPrecio());
                    dto.setStock(product.getStock());
                    dto.setOwnerId(product.getOwner().getId());
                    dto.setCategoriaIds(
                            product.getCategorias().stream()
                                    .map(Category::getId)
                                    .toList()
                    );
                    return dto;
                })
                .orElseThrow(() -> new ResourceNotFoundException("Producto", id));
        // return productoRepository.findById(id).orElse(null);
    }

    public Product saveProducto(Product producto) {
        return productoRepository.save(producto);
    }

    public void deleteProducto(Long id) {
        if (!productoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Producto", id);
        }
        productoRepository.deleteById(id);
    }

    public Product updateProducto(Long id, ProductoUpdateDTO productoDTO) {
        // Validar precio
        if (productoDTO.getPrecio() <= 0) {
            throw new InvalidPriceException(productoDTO.getPrecio());
        }

        // Validar stock
        if (productoDTO.getStock() < 0) {
            throw new InvalidDataException("El stock no puede ser negativo");
        }

        return productoRepository.findById(id)
            .map(producto -> {
                producto.setPrecio(productoDTO.getPrecio());
                producto.setStock(productoDTO.getStock());
                return productoRepository.save(producto);
            })
            .orElseThrow(() -> new ResourceNotFoundException("Producto", id));
    }
}
