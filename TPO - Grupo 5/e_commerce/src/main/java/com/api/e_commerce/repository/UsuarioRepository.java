package com.api.e_commerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.e_commerce.model.Usuario;


public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
	
}
