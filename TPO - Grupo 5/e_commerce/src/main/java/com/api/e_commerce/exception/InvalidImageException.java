package com.api.e_commerce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST)
public class InvalidImageException extends RuntimeException {
    public InvalidImageException(String message) {
        super(message);
    }

    public static InvalidImageException formatoNoSoportado(String formato) {
        return new InvalidImageException(String.format("Formato de imagen no soportado: %s", formato));
    }

    public static InvalidImageException tamañoExcedido(long tamaño, long tamañoMaximo) {
        return new InvalidImageException(
            String.format("Tamaño de imagen (%d bytes) excede el máximo permitido (%d bytes)", 
                tamaño, tamañoMaximo));
    }

    public static InvalidImageException imagenVacia() {
        return new InvalidImageException("La imagen está vacía");
    }
}
