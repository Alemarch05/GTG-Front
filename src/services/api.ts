//Configuracion global del consumo de api base
//SOLO SE CREA UNA VEZ NO SE MODIFICA
import axios from 'axios';
import Swal from 'sweetalert2';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Peticiones (Envía el Token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// NUEVO: Interceptor de Respuestas (Captura Errores Globales)
// Cada vez que la API responde con un error, dispara la alerta modal

api.interceptors.response.use(
  (response) => response, // Si todo sale bien (status 2xx), la petición continúa normal
  (error) => {
    // Intenta extraer el mensaje detallado del backend o usa un mensaje por defecto
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Ocurrió un error inesperado al procesar la solicitud.';

    // Lanza la alerta emergente (Modal)
    Swal.fire({
      icon: 'error',
      title: '¡Algo salió mal!',
      text: Array.isArray(message) ? message.join(', ') : message,
      confirmButtonColor: '#404E3B',
      confirmButtonText: 'Entendido',
    });

    return Promise.reject(error);
  }
);