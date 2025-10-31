package com.api.e_commerce.service;


import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.api.e_commerce.dto.LoginRequest;
import com.api.e_commerce.dto.RegisterRequest;
import com.api.e_commerce.dto.UserDTO;
import com.api.e_commerce.dto.UserUpdateDTO;
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

    public User crearUsuario(RegisterRequest request) {

        if (usuarioRepository.existsByEmail(request.getEmail())) { 
            throw new DuplicateEntityException("usuario", "email", request.getEmail());
        }

        User usuario = User.builder()
                .nombre(request.getNombre())
                .apellido(request.getApellido())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();


        User newUser = usuarioRepository.save(usuario);
        return newUser;
    }

    public List<UserDTO> getAllUsuarios() {
        return usuarioRepository.findAll().stream()
                .map(this::convertToDTO)
                .toList();
    }

    public UserDTO getUsuarioById(Long id) {
        User user = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));
        return convertToDTO(user);
    }

    public void deleteUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario", id);
        }
        usuarioRepository.deleteById(id);
    }

    public UserDTO updateUsuario(Long id, UserUpdateDTO dto) {
        User user = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));

        if (dto.getNombre() != null) user.setNombre(dto.getNombre());
        if (dto.getApellido() != null) user.setApellido(dto.getApellido());
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        User updated = usuarioRepository.save(user);
        return convertToDTO(updated);
    }


    public String authenticate(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        return "Login exitoso";
    }


    public User getUserById(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }


    public User findByEmail(String email) {
        return usuarioRepository.findByEmail(email).orElse(null);
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setNombre(user.getNombre());
        dto.setApellido(user.getApellido());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        return dto;
    }
    
}
