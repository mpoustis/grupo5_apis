package com.api.e_commerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.api.e_commerce.service.ProductoService;
import com.api.e_commerce.dto.ProductoUpdateDTO;
import com.api.e_commerce.model.User;
import com.api.e_commerce.dto.ProductoCreateDTO;
import com.api.e_commerce.dto.ProductoDTO;


@RestController
@RequestMapping("/api/productos") //localhost:8080/api/productos del locahost:8080/api/productos/id
public class ProductoController {
    
    @Autowired
    private ProductoService productoService;

    //https://localhost:8080/api/productos con metodo get http
    @GetMapping
    public ResponseEntity<List<ProductoDTO>> getAllProductos() {
        List<ProductoDTO> productos = productoService.getAllProductos();
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/filtrar")
    public ResponseEntity<List<ProductoDTO>> getFilterProductos(
            @RequestParam(required = false) Long categoria,
            @RequestParam(required = false) String sort) {
        return ResponseEntity.ok(productoService.getProductosFiltrados(categoria, sort));
    }

    @GetMapping("/mis-productos")
    public ResponseEntity<List<ProductoDTO>> getMisProductos(@AuthenticationPrincipal User user) {
        List<ProductoDTO> productos = productoService.getProductosByOwner(user.getId());
        return ResponseEntity.ok(productos);
    }

    // https://localhost:8080/api/productos/3 con metodo get http
    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> getProductoById(@PathVariable Long id) {
        ProductoDTO producto = productoService.getProductoById(id);
        return ResponseEntity.ok(producto);
    }

    //https://localhost:8080/api/productos con metodo POST http, enviar un body
    @PostMapping
    public ResponseEntity<ProductoDTO> addProducto(@RequestBody ProductoCreateDTO productoDTO, @AuthenticationPrincipal User user){
        ProductoDTO producto = productoService.createProducto(productoDTO, user.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(producto);
    }    //https://localhost:8080/api/productos/1 con metodo put http, enviar un body
    
    @PutMapping("/{id}")
    public ResponseEntity<ProductoDTO> updateProducto(@PathVariable Long id, @RequestBody ProductoUpdateDTO productoDTO) {
        ProductoDTO updatedProducto = productoService.updateProducto(id, productoDTO);
        return ResponseEntity.ok(updatedProducto);
    }

    //https://localhost:8080/api/productos/1 con metodo delete http
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProducto(@PathVariable Long id) {
        productoService.deleteProducto(id);
        return ResponseEntity.noContent().build();
    }
    
}
