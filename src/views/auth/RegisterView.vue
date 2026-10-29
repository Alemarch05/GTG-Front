<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');

const handleRegister = async () => {
  errorMessage.value = '';
  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      role: 'USER',
    });
    // Al registrar exitosamente, redirige al Login
    router.push('/login');
  } catch (err: any) {
    errorMessage.value = err || 'Error al completar el registro';
  }
};
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <h2 class="title">Crear Cuenta</h2>
      <p class="subtitle">Regístrate para publicar o apoyar proyectos</p>

      <div v-if="errorMessage" class="alert-error">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleRegister" class="form">
        <div class="form-group">
          <label for="name">Nombre Completo</label>
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="Alejandro Martínez"
            required
          />
        </div>

        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="usuario@ejemplo.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" :disabled="authStore.loading" class="btn-primary">
          {{ authStore.loading ? 'Registrando...' : 'Registrarse' }}
        </button>
      </form>

      <p class="footer-text">
        ¿Ya tienes una cuenta?
        <router-link to="/login">Inicia sesión</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #E6E6E6;
}

.register-card {
  background-color: #FFFFFF;
  padding: 2.5rem;
  border-radius: 12px;
  border: 1px solid #6C8480;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(64, 78, 59, 0.08);
}

.title {
  color: #404E3B;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.subtitle {
  color: #6C8480;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
}

label {
  color: #404E3B;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.4rem;
}

input {
  padding: 0.75rem;
  border: 1px solid #BAC8B1;
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #7B9669;
}

.btn-primary {
  width: 100%;
  padding: 0.8rem;
  background-color: #7B9669;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #404E3B;
}

.alert-error {
  background-color: #fce8e6;
  color: #d93025;
  padding: 0.6rem;
  border-radius: 6px;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.footer-text {
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: #6C8480;
  text-align: center;
}

.footer-text a {
  color: #7B9669;
  font-weight: 600;
  text-decoration: none;
}

.footer-text a:hover {
  text-decoration: underline;
}
</style>