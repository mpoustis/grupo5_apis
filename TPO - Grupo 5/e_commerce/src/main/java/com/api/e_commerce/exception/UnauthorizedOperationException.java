package com.api.e_commerce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.FORBIDDEN)
public class UnauthorizedOperationException extends RuntimeException {
    public UnauthorizedOperationException(String operation, Long userId) {
        super(String.format("Usuario %d no tiene permisos para realizar la operación: %s", 
                userId, operation));
    }
}
