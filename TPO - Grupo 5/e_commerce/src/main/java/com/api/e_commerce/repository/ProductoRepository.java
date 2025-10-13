package com.api.e_commerce.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.e_commerce.model.Product;

//crud: create, read, update, delete
//JpaRepository<ClaseEntidad, TipoDatoPK>
public interface ProductoRepository extends JpaRepository<Product, Long> {
    
    // Métodos CRUD heredados de JpaRepository
    // List<Producto> findAll();
    // Optional<Producto> findById(Long id);
    // Producto save(Producto producto);
    // void deleteById(Long id);

    // Puedes agregar consultas personalizadas si es necesario
    // solo con nombrar el método siguiendo las convenciones de Spring Data JPA
    // jpa genera el sql correcto
    List<Product> findByNombreContaining(String nombre);

    //busca el precion entre un rango
    List<Product> findByPrecioBetween(Double minPrecio, Double maxPrecio);

    //buscar por stock mayor a
    List<Product> findByStockGreaterThan(Integer stock);

    //buscar por stock menor a
    List<Product> findByStockLessThan(Integer stock);
}