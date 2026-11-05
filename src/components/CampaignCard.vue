<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store'; 
import type { Campaign } from '../types/campaign.types';
import ProgressBar from './ProgressBar.vue';
import StatusBadge from './StatusBadge.vue';

const props = defineProps<{
  campaign: Campaign;
}>();

const authStore = useAuthStore();
const router = useRouter();

const isOwner = computed(() => {
  return authStore.user?.id === props.campaign.user_id;
});

const isExpired = computed(() => {
  if (!props.campaign.expires_at) return false;
  return new Date(props.campaign.expires_at).getTime() < new Date().getTime();
});

const daysRemaining = computed(() => {
  if (!props.campaign.expires_at) return 0;
  const diffTime = new Date(props.campaign.expires_at).getTime() - new Date().getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
});

const handleBotonGenerico = () => {
  if (isOwner.value) {
    router.push(`/main/campaigns/${props.campaign.id}/edit`);
  } else {
    router.push(`/main/campaigns/${props.campaign.id}/contribute`);
  }
};
</script>

<template>
  <div class="campaign-card">
    <div class="card-header">
      <h3 class="title">{{ campaign.title }}</h3>
      <StatusBadge :status="campaign.status" />
    </div>
    
    <p class="description">{{ campaign.description?.substring(0, 100) }}...</p>
    
    <ProgressBar 
      :current-amount="Number(campaign.current_amount) || 0" 
      :goal-amount="Number(campaign.target_amount) || 0" 
    />
    
    <div class="card-footer">
      <span class="days-left">
        {{ isExpired ? '⚠️ Campaña Finalizada' : `⏳ ${daysRemaining} días restantes` }}
      </span>
      
      <div class="action-buttons">
        <router-link :to="`/main/campaigns/${campaign.id}`" class="btn-outline">
          Ver Detalle
        </router-link>
      
        <button 
          v-if="authStore.isAuthenticated" 
          @click="handleBotonGenerico" 
          class="boton_generico"
          :class="isOwner ? 'btn-edit' : 'btn-contribute'"
        >
          {{ isOwner ? 'Editar' : 'Aportar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.boton_generico {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-edit {
  background-color: #6C8480;
  color: white;
}
.btn-edit:hover { background-color: #556B68; }

.btn-contribute {
  background-color: #7B9669;
  color: white;
}
.btn-contribute:hover { background-color: #617A51; }

.campaign-card {
  background-color: #FFFFFF;
  border: 1px solid #E6E6E6; /* Gris claro */
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(108, 132, 128, 0.1); /* Sombra suave con Verde grisáceo */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.campaign-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(64, 78, 59, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.title {
  color: #404E3B; /* Verde oscuro */
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0;
}

.description {
  color: #6C8480;
  font-size: 0.9rem;
  line-height: 1.4;
  flex-grow: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #E6E6E6;
}

.days-left {
  font-size: 0.85rem;
  color: #6C8480;
  font-weight: 500;
}

.btn-outline {
  padding: 0.5rem 1rem;
  color: #7B9669; /* Verde olivo */
  border: 1px solid #7B9669;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-outline:hover {
  background-color: #7B9669;
  color: #FFFFFF;
}
</style>