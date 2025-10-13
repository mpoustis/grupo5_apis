package com.api.e_commerce.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.api.e_commerce.model.Product;
import com.api.e_commerce.repository.ProductoRepository;
import com.api.e_commerce.dto.ProductoUpdateDTO;

@Service
@Transactional
public class ProductoService {
    
    @Autowired
    private ProductoRepository productoRepository;

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
