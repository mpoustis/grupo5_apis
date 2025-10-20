package com.api.e_commerce.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;


@Data
@Entity
@Table(name = "usuarios")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String nombre;
    @Column(nullable = false)
    private String apellido;
    private String email;
    private String password;
    
    @OneToMany(mappedBy = "buyer", fetch = FetchType.LAZY)
    private List<Order> pedidos;

}
