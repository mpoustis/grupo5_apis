package com.api.e_commerce.dto;

import lombok.Data;

@Data
public class UserUpdateDTO {
    private String nombre;
    private String apellido;
    private String password;
}
