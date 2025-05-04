// src/services/api.js
import axios from "axios";

// URL del backend
const BASE_URL = "http://localhost:8000/api/";

// Obtenemos el token desde localStorage

const getAccessToken = () => localStorage.getItem("access");

// Creamos una instancia de Axios con la URL base y el token Bearer
const api = axios.create({
  baseURL: BASE_URL,
});

// Interceptor para agregar automáticamente el token a cada request
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptar respuestas 401 (Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      localStorage.getItem("access")
    ) {
      // Eliminar tokens caducados
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      // Redirigir al login
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;

// Crea una instancia de Axios con base en http://localhost:8000/api/
// Añade automáticamente el token Bearer ACCESS_TOKEN a todas las peticiones si el token está guardado en localStorage