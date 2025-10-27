package com.api.e_commerce.service;

import java.net.http.HttpResponse;
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

        // Validar que se encontraron todas las categorías
        if (categories.size() != dto.getCategoriaIds().size()) {
            throw new ResourceNotFoundException("Una o más categorías no fueron encontradas");
        }

        Product producto = new Product();
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setStock(dto.getStock());
        producto.setCategorias(categories);

        producto.setOwner(owner);

        if(dto.getImages() != null && !dto.getImages().isEmpty()){
            // Validar imágenes antes de guardarlas
            for (MultipartFile image : dto.getImages()) {
                String contentType = image.getContentType();
                if (contentType == null || !contentType.startsWith("image/")) {
                    throw InvalidImageException.formatoNoSoportado(contentType);
                }
                
                // Asumiendo un tamaño máximo de 5MB
                if (image.getSize() > 5 * 1024 * 1024) {
                    throw InvalidImageException.tamañoExcedido(image.getSize(), 5 * 1024 * 1024);
                }
                
                if (image.isEmpty()) {
                    throw InvalidImageException.imagenVacia();
                }
            }

            List<String> urlsImages = imagenService.guardarImagenes(
                    dto.getImages(),
                    producto.getId()
            );

            for(int i = 0; i < urlsImages.size(); i++){
                Image image = new Image();
                image.setProducto(producto);
                image.setUrl(urlsImages.get(i));
                image.setPosition(i+1);

                imagenProductoRepository.save(image);
            }
        }
        Product productoGuardado = productoRepository.findById(producto.getId()).orElse(producto);
        return new ResponseEntity<>(productoGuardado, HttpStatus.CREATED);
    }

    public List<Product> getAllProductos() {
        return productoRepository.findAll();
    }

    public Product getProductoById(Long id) {
        return productoRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Producto", id));
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
