<script setup lang="ts">
import { useAuthStore } from '../stores/auth.store';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/auth/login');
};
</script>
//probando
<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="nav-brand">GTG Crowdfunding</router-link>
      <div class="nav-links">
        <router-link to="/" class="nav-item">Campañas</router-link>
        
        <template v-if="authStore.isAuthenticated">
          <router-link to="/my-contributions" class="nav-item">Mis Aportes</router-link>
          <span class="user-name">Hola, {{ authStore.user?.name }}</span>
          <button @click="handleLogout" class="btn-logout">Cerrar Sesión</button>
        </template>
        
        <template v-else>
          <router-link to="/auth/login" class="btn-link">Login</router-link>
          <router-link to="/auth/register" class="btn-primary">Registro</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: #404E3B;
  padding: 1rem 0;
}
.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.nav-brand {
  color: #E6E6E6;
  font-size: 1.25rem;
  font-weight: 700;
  text-decoration: none;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}
.nav-item {
  color: #E6E6E6;
  text-decoration: none;
  font-weight: 500;
}
.nav-item:hover { color: #BAC8B1; }
.user-name { color: #BAC8B1; font-weight: 600; font-size: 0.9rem; }
.btn-logout, .btn-link {
  background: transparent;
  border: 1px solid #6C8480;
  color: #E6E6E6;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
}
.btn-primary {
  background-color: #7B9669;
  color: #E6E6E6;
  padding: 6px 14px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
}
</style>