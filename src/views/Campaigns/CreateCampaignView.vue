<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCampaignStore } from '../../stores/campaign.store';
import { useAuthStore } from '../../stores/auth.store';
import BaseAlert from '../../components/BaseAlert.vue';

const campaignStore = useCampaignStore();
const authStore = useAuthStore();
const router = useRouter();

const form = ref({
  title: '',
  description: '',
  targetAmount: 0,
  expiresAt: ''
});

const submitForm = async () => {
  const currentUserId = authStore.user?.id;

  if (!currentUserId) {
    return; 
  }

  try {
    await campaignStore.createCampaign({
      userId: currentUserId,
      title: form.value.title,
      description: form.value.description,
      targetAmount: Number(form.value.targetAmount),
      expiresAt: new Date(form.value.expiresAt).toISOString()
    });
    
    router.push('/main/campaigns');
  } catch (error) {
  }
};
</script>

<template>
  <div class="create-container">
    <h2>Crear Nueva Campaña</h2>

    <div v-if="campaignStore.error" style="margin-bottom: 1.5rem;">
      <BaseAlert type="error" :message="campaignStore.error" />
    </div>
    
    <form @submit.prevent="submitForm" class="campaign-form">
      <div class="form-group">
        <label>Título de la Campaña</label>
        <input v-model="form.title" type="text" required placeholder="Ej. Videojuego Indie" />
      </div>

      <div class="form-group">
        <label>Descripción</label>
        <textarea v-model="form.description" required rows="4" placeholder="Explica tu proyecto..."></textarea>
      </div>

      <div class="form-group">
        <label>Meta de Recaudación ($)</label>
        <input v-model="form.targetAmount" type="number" required min="1" />
      </div>

      <div class="form-group">
        <label>Fecha de Finalización</label>
        <input v-model="form.expiresAt" type="datetime-local" required />
      </div>

      <div class="actions">
        <button type="button" class="btn-outline" @click="router.push('/main/campaigns')">Cancelar</button>
        <button type="submit" class="btn-primary" :disabled="campaignStore.loading">
          {{ campaignStore.loading ? 'Creando...' : 'Crear Campaña' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.create-container { max-width: 600px; margin: 2rem auto; padding: 2rem; background: #FFF; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
h2 { color: #404E3B; margin-bottom: 1.5rem; text-align: center; }
.form-group { margin-bottom: 1.5rem; }
label { display: block; margin-bottom: 0.5rem; color: #404E3B; font-weight: 600; font-size: 0.9rem; }
input, textarea { width: 100%; padding: 10px; border: 1px solid #E6E6E6; border-radius: 6px; font-family: inherit; }
.actions { display: flex; justify-content: space-between; margin-top: 2rem; }
.btn-primary { background-color: #7B9669; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
.btn-outline { background: transparent; color: #6C8480; border: 1px solid #6C8480; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600; }
</style>