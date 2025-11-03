// Código para manejar productos vía API REST (con filtros y orden)
// - Filtrar por públicos (public=true)
// - Filtrar por múltiples categorías (category=a&category=b)
// - Ordenar por precio (asc | desc)

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

/**
 * Transforma un producto del formato backend al frontend
 */
function transformProductToFrontend(product) {
  return {
    id: product.id,
    name: product.nombre,
    description: product.descripcion,
    price: product.precio,
    originalPrice: product.precioOriginal || product.precio * 1.2,
    image: product.images && product.images.length > 0 
      ? product.images[0].url  // Ruta relativa: /uploads/xxx.jpg
      : "/api/placeholder/280/200",
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

/**
 * Listar productos con filtros opcionales
 * @param {Object} [opts]
 * @param {boolean} [opts.onlyPublic=true] Si true, agrega public=true
 * @param {string|string[]} [opts.categories] Una o más categorías exactas
 * @param {"asc"|"desc"|null} [opts.order=null] Si se define, ordena por precio
 */
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
    
    // ✅ Transformar datos del backend al formato del frontend
    return data.map(transformProductToFrontend);
  } catch (error) {
    console.error('Error en listProducts:', error);
    throw error;
  }
}

/**
 * Listar solo los productos del usuario actual
 */
export async function listMyProducts() {
  const token = getCurrentToken();
  
  try {
    const data = await http(`${API_BASE_URL}/mis-productos`, {
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`    
      },
    });

    // ✅ ESTO ERA LO QUE FALTABA: Transformar los datos
    return data.map(transformProductToFrontend);
  } catch (error) {
    console.error('Error en listMyProducts:', error);
    throw error;
  }
}

/**
 * Obtener un producto específico por ID
 */
export async function getProduct(id) {
  try {
    const product = await http(`${API_BASE_URL}/${id}`);
    return transformProductToFrontend(product);
  } catch (error) {
    console.error('Error en getProduct:', error);
    throw error;
  }
}

/**
 * Crear un nuevo producto
 */
export async function createProduct(product) {
  const token = getCurrentToken();
  const { id: userId } = token || {};
  
  // Transformar del formato frontend al formato backend
  const payload = {
    nombre: product.name?.trim() || "",
    descripcion: product.description?.trim() || "",
    precio: Number(product.price) || 0,
    stock: Number(product.stock) || 0,
    ownerId: Number(userId) || 0,
  };

  // Campos opcionales
  if (product.originalPrice !== undefined) {
    payload.precioOriginal = Number(product.originalPrice);
  }
  if (product.category !== undefined && product.category !== "") {
    payload.categoriaId = Number(product.category);
  }
  if (product.brand !== undefined) {
    payload.marca = product.brand.trim();
  }
  if (product.rating !== undefined) {
    payload.rating = Number(product.rating);
  }
  if (product.reviews !== undefined) {
    payload.reviews = Number(product.reviews);
  }
  if (product.public !== undefined) {
    payload.public = product.public;
  }
  if (product.tax !== undefined) {
    payload.tax = Number(product.tax);
  }
  if (product.cuotas !== undefined) {
    payload.cuotas = Number(product.cuotas);
  }
  if (product.fee !== undefined) {
    payload.fee = Number(product.fee);
  }
  if (product.image !== undefined) {
    payload.image = product.image;
  }

  try {
    const result = await http(API_BASE_URL, { 
      method: "POST", 
      body: JSON.stringify(payload) 
    });
    return result;
  } catch (error) {
    console.error('Error en createProduct:', error);
    throw error;
  }
}

/**
 * Actualizar producto (PATCH parcial)
 */
export async function updateProduct(id, partial) {
  // Transformar campos del frontend al backend si existen
  const payload = {};
  
  if (partial.name !== undefined) payload.nombre = partial.name.trim();
  if (partial.description !== undefined) payload.descripcion = partial.description.trim();
  if (partial.price !== undefined) payload.precio = Number(partial.price);
  if (partial.originalPrice !== undefined) payload.precioOriginal = Number(partial.originalPrice);
  if (partial.stock !== undefined) payload.stock = Number(partial.stock);
  if (partial.category !== undefined) payload.categoriaId = Number(partial.category);
  if (partial.brand !== undefined) payload.marca = partial.brand.trim();
  if (partial.rating !== undefined) payload.rating = Number(partial.rating);
  if (partial.reviews !== undefined) payload.reviews = Number(partial.reviews);
  if (partial.public !== undefined) payload.public = partial.public;
  if (partial.tax !== undefined) payload.tax = Number(partial.tax);
  if (partial.cuotas !== undefined) payload.cuotas = Number(partial.cuotas);
  if (partial.fee !== undefined) payload.fee = Number(partial.fee);
  if (partial.image !== undefined) payload.image = partial.image;

  console.log('Payload a enviar:', JSON.stringify(payload));
  
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

/**
 * Eliminar un producto
 */
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