package com.api.e_commerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;

import com.api.e_commerce.dto.AuthResponse;
import com.api.e_commerce.dto.LoginRequest;
import com.api.e_commerce.dto.RegisterRequest;
import com.api.e_commerce.model.User;
import com.api.e_commerce.repository.UsuarioRepository;
import com.api.e_commerce.security.JwtService;
import com.api.e_commerce.service.UsuarioService;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UsuarioService usuarioService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        User user = usuarioService.crearUsuario(request);

        HashMap<String,String> claims = new HashMap<>();
        claims.put("userId",user.getId().toString());
        String token = jwtService.generateToken(user,claims);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = usuarioService.findByEmail(request.getEmail());

        HashMap<String,String> claims = new HashMap<>();
        claims.put("userId",user.getId().toString());
        String token = jwtService.generateToken(user,claims);
        return ResponseEntity.ok(new AuthResponse(token));
    }
}
