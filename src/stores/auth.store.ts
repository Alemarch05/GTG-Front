import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { api } from '../services/api';
import type { User, LoginDTO, RegisterDTO, AuthResponse } from '../types/auth.types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'));
  const token = ref<string | null>(localStorage.getItem('token'));
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  async function login(credentials: LoginDTO) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const authData = response.data.data;

      token.value = authData.token;
      user.value = authData.user;

      localStorage.setItem('token', authData.token);
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

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
  };
});