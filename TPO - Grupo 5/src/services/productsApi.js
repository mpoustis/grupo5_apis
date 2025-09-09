// Código para manejar productos vía API REST (con filtros y orden)
// - Filtrar por públicos (public=true)
// - Filtrar por múltiples categorías (category=a&category=b)
// - Ordenar por precio (asc | desc)

import { getCurrentUser } from "./auth";

const BASE = "/api/products";

async function http(url, options) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
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

  if (order === "asc" || order === "desc") {
    params.set("_sort", "price");
    params.set("_order", order);
  }

  const url = params.toString() ? `${BASE}?${params.toString()}` : BASE;
  return http(url);
}

// Solo los del usuario actual
export async function listMyProducts() {
  const { id } = getCurrentUser();
  return http(`${BASE}?ownerId=${id}`);
}

// Obtener producto por id
export async function getProduct(id) {
  return http(`${BASE}/${id}`);
}

// Crear producto, asignando ownerId del usuario actual
export async function createProduct(product) {
  const { id: ownerId } = getCurrentUser();
  const body = { ownerId, ...product };
  return http(BASE, { method: "POST", body: JSON.stringify(body) });
}

// Actualizar producto (PATCH parcial para no pisar campos)
export async function updateProduct(id, partial) {
  return http(`${BASE}/${id}`, { method: "PATCH", body: JSON.stringify(partial) });
}

// Borrar producto
export async function deleteProduct(id) {
  return http(`${BASE}/${id}`, { method: "DELETE" });
}
