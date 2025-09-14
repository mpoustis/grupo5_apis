// Simple mock de sesión para desarrollo con json-server
const KEY = "1"; // ID del usuario actual

export function setCurrentUserId(id) {
  localStorage.setItem(KEY, String(id));
}

// Devuelve id 
export function getCurrentUser() {
  const raw = localStorage.getItem(KEY);
  const id = raw ? Number(raw) : 1;
  return { id };
}
