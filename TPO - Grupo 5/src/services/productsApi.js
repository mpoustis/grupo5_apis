// Codigo para manejar productos via API REST

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

// Listar todos los productos
export async function listProducts() {
  return http(BASE);
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

// Actualizar producto
export async function updateProduct(id, partial) {
  // PATCH parcial para no pisar campos
  return http(`${BASE}/${id}`, { method: "PATCH", body: JSON.stringify(partial) });
}

// Borrar producto
export async function deleteProduct(id) {
  return http(`${BASE}/${id}`, { method: "DELETE" });
}
