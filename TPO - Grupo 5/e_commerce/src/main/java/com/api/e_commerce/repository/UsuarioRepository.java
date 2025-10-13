package com.api.e_commerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.api.e_commerce.model.User;


public interface UsuarioRepository extends JpaRepository<User, Long> {
	
}
