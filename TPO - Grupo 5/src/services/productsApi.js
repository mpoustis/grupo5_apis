// Código para manejar productos vía API REST (con filtros y orden)
// - Filtrar por públicos (public=true)
// - Filtrar por múltiples categorías (category=a&category=b)
// - Ordenar por precio (asc | desc)

import { getCurrentToken } from "../services/auth";

const API_URL = "http://localhost:8081/api/productos";


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

/**
 * Listar productos con filtros opcionales
 * @param {Object} [opts]
 * @param {boolean} [opts.onlyPublic=true]   Si true, agrega public=true
 * @param {string|string[]} [opts.categories] Una o más categorías exactas
 * @param {"asc"|"desc"|null} [opts.order=null] Si se define, ordena por precio
 */
export async function listProducts(opts = {}) {
  const {
    onlyPublic = true,
    categories,
    order = null, // "asc" | "desc" | null (sin orden)
  } = opts;

  const params = new URLSearchParams();

  if (onlyPublic) params.set("public", "true");

  if (Array.isArray(categories)) {
    for (const c of categories) params.append("category", c);
  } else if (typeof categories === "string" && categories) {
    params.set("category", categories);
  }

  if (order === "asc") {
    params.set("_sort", "price");
  } else if (order === "desc") {
    params.set("_sort", "-price");
  }

  const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
  return http(url);
}

// Solo los del usuario actual
export async function listMyProducts() {
  const token = getCurrentToken();
  return http(`${API_URL}/mis-productos`, {
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`    
    },
  });
}

// Obtener producto por id
export async function getProduct(id) {
  return http(`${API_URL}mis-productos`);
}

// Crear producto, asignando ownerId del usuario actual
export async function createProduct(product) {
  const { id: ownerId } = getCurrentToken();
  const body = { ownerId, ...product };
  return http(API_URL, { method: "POST", body: JSON.stringify(body) });
}

// Actualizar producto (PATCH parcial para no pisar campos)
export async function updateProduct(id, partial) {
  console.log(JSON.stringify(partial))
  return http(`${API_URL}/${id}`, { method: "PATCH", body: JSON.stringify(partial) });
}

// Borrar producto
export async function deleteProduct(id) {
  return http(`${API_URL}/${id}`, { method: "DELETE" });
}