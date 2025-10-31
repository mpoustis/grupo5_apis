package com.api.e_commerce.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String role;
}
