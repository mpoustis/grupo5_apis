// URL base de tu backend Spring Boot. ¡REVISADO: PUERTO 8081!
const API_URL = "http://localhost:8081/api/auth";
const TOKEN_KEY = 'authToken'; // Clave para sessionStorage

export function getCurrentToken() {
    return sessionStorage.getItem(TOKEN_KEY);
}

export async function registerUser(formData) {
    const MAX_RETRIES = 3;
    let lastError = null;

    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            const response = await fetch(API_URL+"/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                const errorMessage = data.message || "Error desconocido al registrar.";
                sessionStorage.removeItem(TOKEN_KEY); 
                throw new Error(errorMessage);
            }
            
            // GUARDAR TOKEN EN SESSION STORAGE
            const token = data.token;
            sessionStorage.setItem(TOKEN_KEY, token);
            
            return token;

        } catch (error) {
            lastError = error;
            if (i < MAX_RETRIES - 1) {
                const delay = Math.pow(2, i) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    throw lastError;
}

export async function loginUser(credentials) {
    const response = await fetch("http://localhost:8081/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
        const msg = data.message || "Credenciales incorrectas";
        throw new Error(msg);
    }

    sessionStorage.setItem("authToken", data.token);
    return data.token;
}

export function getDecodedUser() {
    const token = getCurrentToken(); // Obtiene el token
    const payload = decodeJwt(token); // Decodifica el payload

    if (payload) {
        return payload;
    }
    return null;
}

export function decodeJwt(token) {
    if (!token) {
        return null;
    }

    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error("Formato de token JWT inválido (no tiene 3 partes).");
            return null;
        }

        const payload = parts[1];

        let base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
            base64 += '=';
        }

        const jsonPayload = atob(base64);

        return JSON.parse(jsonPayload);

    } catch (e) {
        console.error("Error al decodificar o parsear el JWT:", e);
        return null;
    }
}