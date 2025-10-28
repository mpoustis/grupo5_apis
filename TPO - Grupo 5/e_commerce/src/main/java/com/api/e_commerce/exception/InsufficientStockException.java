package com.api.e_commerce.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.CONFLICT)
public class InsufficientStockException extends RuntimeException {
    public InsufficientStockException(Long productId, int requestedQuantity, int availableStock) {
        super(String.format("No hay suficiente stock para el producto %d. Solicitado: %d, Disponible: %d",
                productId, requestedQuantity, availableStock));
    }
}
