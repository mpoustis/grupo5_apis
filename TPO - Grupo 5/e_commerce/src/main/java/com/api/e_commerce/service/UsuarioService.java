package com.api.e_commerce.service;


import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.api.e_commerce.dto.LoginRequest;
import com.api.e_commerce.dto.RegisterRequest;
import com.api.e_commerce.model.Role;
import com.api.e_commerce.model.User;
import com.api.e_commerce.repository.UsuarioRepository;
import com.api.e_commerce.exception.DuplicateEntityException;
import com.api.e_commerce.exception.ResourceNotFoundException;

import java.util.List;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UsuarioService {
    
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public String register(RegisterRequest request) {

        if (usuarioRepository.existsByEmail(request.getEmail())) { 
            /* crear excepcion*/
            throw new DuplicateEntityException("usuario", "email", email);
        }

        User usuario = User.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();


        usuarioRepository.save(usuario);
        return "Usuario registrado exitosamente";
    }


    public String authenticate(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        return "Login exitoso";
    }

        public List<User> getAllUsuarios() {
        return usuarioRepository.findAll();
    }

    public User getUserById(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }
    
}
