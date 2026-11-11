import axios from 'axios';
import Swal from 'sweetalert2';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Manejo Silencioso de Token Expirado (Tu lógica)
    if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
      originalRequest._retry = true; 
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const refreshResponse = await axios.post('http://localhost:3000/api/auth/refresh', { refreshToken });
          
          const newAccessToken = refreshResponse.data.data.accessToken;
          const newRefreshToken = refreshResponse.data.data.refreshToken;

          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        }
      } else {
        localStorage.clear();
        window.location.href = '/auth/login';
        return Promise.reject(error);
      }
    }
    
    // 2. Alerta Visual para cualquier otro error (Lógica de Dev)
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Ocurrió un error inesperado al procesar la solicitud.';

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