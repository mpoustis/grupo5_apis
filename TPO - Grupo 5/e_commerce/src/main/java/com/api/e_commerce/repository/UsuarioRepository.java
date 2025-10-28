package com.api.e_commerce.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.api.e_commerce.model.User;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<User, Long> {

    /*QueryMethods */
	Optional<User> findByEmail(String email);

    Boolean existsByEmail(String email);
}
