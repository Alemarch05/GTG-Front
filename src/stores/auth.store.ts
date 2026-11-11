import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '../services/api';
import type { User, LoginDTO, RegisterDTO } from '../types/auth.types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'));
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'));
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!accessToken.value);

  async function login(credentials: LoginDTO) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post('/auth/login', credentials);
      const authData = response.data.data;

      // Mantenemos tu lógica de doble token (Requisito de rúbrica)
      accessToken.value = authData.accessToken;
      refreshToken.value = authData.refreshToken;
      user.value = authData.user;

      localStorage.setItem('accessToken', authData.accessToken);
      localStorage.setItem('refreshToken', authData.refreshToken);
      localStorage.setItem('user', JSON.stringify(authData.user));
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al iniciar sesión';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function register(userData: RegisterDTO) {
    loading.value = true;
    error.value = null;
    try {
      await api.post('/users/register', userData);
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al registrar usuario';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    if (refreshToken.value) {
      try {
        await api.post('/auth/logout', { refreshToken: refreshToken.value });
      } catch (err) {
        console.warn('El token ya estaba revocado o expirado en el servidor');
      }
    }
    
    accessToken.value = null;
    refreshToken.value = null;
    user.value = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  }

  return {
    user,
    accessToken,
    refreshToken,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
  };
});