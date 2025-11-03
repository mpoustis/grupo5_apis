// Código para manejar productos vía API REST (con filtros y orden)
import { getCurrentToken } from "../services/auth";

const API_BASE_URL = "http://localhost:8080/api/productos";
const API_URL = `${API_BASE_URL}/filtrar`;

// ========================================
// FUNCIÓN AUXILIAR HTTP
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

function transformProductToFrontend(product) {
  return {
    id: product.id,
    name: product.nombre,
    description: product.descripcion,
    price: product.precio,
    originalPrice: product.precioOriginal || product.precio * 1.2,
    image: product.images && product.images.length > 0 
      ? product.images[0].url
      : "",
    images: product.images || [],
    brand: product.marca || "TECHPRO",
    category: product.categoriaId || "",
    rating: product.rating || 4,
    reviews: product.reviews || 0,
    inStock: product.stock > 0,
    stock: product.stock,
    public: product.public !== undefined ? product.public : true,
    ownerId: product.ownerId,
    tax: product.tax || 0.21,
    cuotas: product.cuotas || 1,
    fee: product.fee || 0
  };
}

// ========================================
// FUNCIONES DE API
// ========================================

export async function listProducts(opts = {}) {
  const {
    onlyPublic = true,
    categories,
    order = null,
  } = opts;

  const params = new URLSearchParams();

  if (onlyPublic) params.set("public", "true");

  if (Array.isArray(categories) && categories.length > 0) {
    for (const c of categories) params.append("category", c);
  } else if (typeof categories === "string" && categories) {
    params.set("category", categories);
  }

  if (order === "asc") {
    params.set("orderBy", "precio");
    params.set("order", "asc");
  } else if (order === "desc") {
    params.set("orderBy", "precio");
    params.set("order", "desc");
  }

  const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al obtener productos');
    
    const data = await response.json();
    return data.map(transformProductToFrontend);
  } catch (error) {
    console.error('Error en listProducts:', error);
    throw error;
  }
}

export async function listMyProducts() {
  const token = getCurrentToken();
  
  try {
    const data = await http(`${API_BASE_URL}/mis-productos`, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`    
      },
    });

    return data.map(transformProductToFrontend);
  } catch (error) {
    console.error('Error en listMyProducts:', error);
    throw error;
  }
}

export async function getProduct(id) {
  try {
    const product = await http(`${API_BASE_URL}/${id}`);
    return transformProductToFrontend(product);
  } catch (error) {
    console.error('Error en getProduct:', error);
    throw error;
  }
}


export async function createProduct(product) {
  // Validación básica
  if (!product.name?.trim()) {
    throw new Error("El nombre del producto es obligatorio");
  }

  const payload = {
    nombre: product.name.trim(),
    descripcion: product.description?.trim() || "",
    precio: Number(product.price) || 0,
    stock: Number(product.stock) || 0,
    categoriaId: product.category ? Number(product.category) : null,
    images: product.image && product.image.trim() !== "" ? [product.image] : []
  };

  try {
    const result = await http(API_BASE_URL, { 
      method: "POST", 
      body: JSON.stringify(payload) 
    });
    return result;
  } catch (error) {
    console.error(' Error en createProduct:', error);
    throw error;
  }
}


export async function updateProduct(id, partial) {
  const payload = {};
  
  if (partial.name !== undefined) payload.nombre = partial.name.trim();
  if (partial.description !== undefined) payload.descripcion = partial.description.trim();
  if (partial.price !== undefined) payload.precio = Number(partial.price);
  if (partial.stock !== undefined) payload.stock = Number(partial.stock);
  if (partial.category !== undefined) payload.categoriaId = Number(partial.category);
  
  if (partial.image !== undefined && partial.image.trim() !== "") {
    payload.images = [partial.image];
  }

  console.log('Payload actualización:', JSON.stringify(payload, null, 2));
  
  try {
    const result = await http(`${API_BASE_URL}/${id}`, { 
      method: "PATCH", 
      body: JSON.stringify(payload) 
    });
    return result;
  } catch (error) {
    console.error('Error en updateProduct:', error);
    throw error;
  }
}

export async function deleteProduct(id) {
  try {
    const result = await http(`${API_BASE_URL}/${id}`, { 
      method: "DELETE" 
    });
    return result;
  } catch (error) {
    console.error('Error en deleteProduct:', error);
    throw error;
  }
}