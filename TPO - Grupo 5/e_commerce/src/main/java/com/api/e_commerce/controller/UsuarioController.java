package com.api.e_commerce.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.api.e_commerce.model.User;
import com.api.e_commerce.service.UsuarioService;

@RestController
@RequestMapping("/api/usuarios") //localhost:8080/api/usuarios
public class UsuarioController {
 
    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public List<User> getAllUsuarios() {
        return usuarioService.getAllUsuarios();
    }

    @PostMapping
    public User addUsuario(@RequestBody User usuario) {
        return usuarioService.save(usuario);
    }
}
