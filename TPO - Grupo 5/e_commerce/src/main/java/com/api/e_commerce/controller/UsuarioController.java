package com.api.e_commerce.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.api.e_commerce.dto.UserDTO;
import com.api.e_commerce.dto.UserUpdateDTO;
import com.api.e_commerce.service.UsuarioService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/usuarios") //localhost:8080/api/usuarios
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsuarios() {
        return ResponseEntity.ok(usuarioService.getAllUsuarios());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUsuarioById(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.getUsuarioById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUsuario(
            @PathVariable Long id,
            @RequestBody UserUpdateDTO dto) {
        UserDTO usuarioActualizado = usuarioService.updateUsuario(id, dto);
        return ResponseEntity.ok(usuarioActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable Long id) {
        usuarioService.deleteUsuario(id);
        return ResponseEntity.noContent().build();
    }

}
