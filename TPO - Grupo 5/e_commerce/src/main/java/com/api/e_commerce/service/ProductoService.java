package com.api.e_commerce.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.api.e_commerce.dto.ProductoCreateDTO;
import com.api.e_commerce.dto.ProductoUpdateDTO;
import com.api.e_commerce.model.Category;
import com.api.e_commerce.model.Image;
import com.api.e_commerce.model.Product;
import com.api.e_commerce.model.User;
import com.api.e_commerce.repository.CategoryRepository;
import com.api.e_commerce.repository.ImagenProductoRepository;
import com.api.e_commerce.repository.ProductoRepository;

import lombok.AllArgsConstructor;

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

        User owner = usuarioService.getUserById(dto.getOwnerId());
        List<Category> categories = categoryRepository.findAllById(dto.getCategoriaIds());

        Product producto = new Product();
        producto.setNombre(dto.getNombre());
        producto.setDescripcion(dto.getDescripcion());
        producto.setPrecio(dto.getPrecio());
        producto.setStock(dto.getStock());
        producto.setCategorias(categories);

        producto.setOwner(owner);

        producto = productoRepository.save(producto);

        if(dto.getImages() != null && !dto.getImages().isEmpty()){
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
        return productoRepository.findById(id).orElse(null);
    }

    public Product saveProducto(Product producto) {
        return productoRepository.save(producto);
    }

    public void deleteProducto(Long id) {
        productoRepository.deleteById(id);
    }    

    public Product updateProducto(Long id, ProductoUpdateDTO productoDTO) {
        return productoRepository.findById(id)
            .map(producto -> {
                producto.setPrecio(productoDTO.getPrecio());
                producto.setStock(productoDTO.getStock());
                return productoRepository.save(producto);
            })
            .orElse(null);
    }
}
