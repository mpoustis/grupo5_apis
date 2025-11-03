// ordersApi.js

import { getCurrentToken } from "./auth"; // Asume que 'auth' está en la misma carpeta que 'productsApi'

// **IMPORTANTE**: Define la URL base para tu API de Órdenes.
const API_BASE_URL = "http://localhost:8080/api/orders"; // Ajusta el puerto y la ruta si es necesario

// ========================================
// FUNCIÓN AUXILIAR HTTP (Copiada/Asumida desde productsApi)
// Deberías mover esta función a un archivo compartido como 'http.js' o 'apiUtils.js'
// para evitar duplicación de código. Por ahora, la incluimos para que funcione.
// ========================================
async function http(url, options = {}) {
  const token = getCurrentToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} - ${text || res.statusText}`);
  }

  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : null;
}

// ========================================
// TRANSFORMADOR (Backend → Frontend)
// ========================================

/**
 * Transforma un objeto de orden del backend (que ya debería ser similar a OrderDTO) 
 * al formato esperado por el frontend.
 * En este caso, OrderDTO y OrderItemDetailDTO ya están en formato JS (camelCase) 
 * por lo que solo se devuelve el objeto.
 * * @param {object} orderBackend - Objeto de orden retornado por la API.
 * @returns {OrderDTO} El objeto de orden listo para el frontend.
 */
function transformOrderToFrontend(orderBackend) {
    // Si tu backend retorna campos en snake_case o español, haz las transformaciones aquí.
    // Ej: status: orderBackend.estado,
    // Asumiendo que el backend retorna directamente los campos de OrderDTO (id, buyerId, status, etc.)
    return orderBackend; 
}


// ========================================
// FUNCIONES DE API DE ÓRDENES
// ========================================

/**
 * Obtiene la lista de órdenes asociadas al usuario autenticado.
 * Requiere el token de autorización.
 * * @returns {Promise<OrderDTO[]>} Lista de órdenes.
 */
export async function listMyOrders() {
    // La URL debe apuntar al endpoint que devuelve las órdenes del usuario, 
    // similar a como 'mis-productos' devuelve los productos del usuario.
    const url = `${API_BASE_URL}`; // **Ajusta este endpoint si tu API usa uno diferente**
  
    try {
        // Usamos la función http auxiliar que automáticamente añade la autorización
        // a través de getCurrentToken().
        const data = await http(url, { 
            method: "GET" // Opcional, ya que GET es el método por defecto
        });

        // El backend debe devolver un array de objetos OrderDTO
        return data.map(transformOrderToFrontend);

    } catch (error) {
        console.error('❌ Error en listMyOrders:', error);
        // Volvemos a lanzar el error para que el componente React lo maneje
        throw error;
    }
}

export async function createOrder(cartItems) {
    if (!cartItems || cartItems.length === 0) {
        throw new Error("No se pueden crear una orden sin artículos en el carrito.");
    }

    // 1. Mapear los ítems del carrito a OrderItemDTO (ProductId y Quantity)
    // El backend espera un objeto CreateOrderDTO que contiene esta lista.
    // El 'buyerId' se asume que se extrae del token JWT en el backend.
    const orderItemsPayload = cartItems.map(item => ({
        // Asumiendo que el 'id' del ítem del carrito es el 'productId'
        productId: item.id, 
        quantity: item.quantity,
    }));

    // El cuerpo de la petición (CreateOrderDTO)
    const createOrderDTO = {
        items: orderItemsPayload,
        // Otros campos opcionales si los necesita tu CreateOrderDTO (ej: addressId, paymentMethod)
    };
    
    // 2. Realizar la petición POST al endpoint de creación de órdenes
    const url = API_BASE_URL; // http://localhost:8081/api/orders

    try {
        // Usamos la función http para incluir el token de autorización
        const createdOrder = await http(url, {
            method: "POST",
            body: JSON.stringify(createOrderDTO),
        });

        // El backend devuelve OrderDTO
        return createdOrder; 

    } catch (error) {
        console.error('❌ Error al crear la orden:', error);
        throw new Error(`Fallo al completar la compra: ${error.message}`);
    }
}