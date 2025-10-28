package com.api.e_commerce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST)
public class InvalidPriceException extends RuntimeException {
    public InvalidPriceException(Double price) {
        super(String.format("El precio %,.2f no es válido. Debe ser mayor que 0", price));
    }
}
