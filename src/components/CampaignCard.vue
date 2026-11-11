<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store';
import { useContributionStore } from '../stores/contribution.store';
import type { Campaign } from '../types/campaign.types';
import ProgressBar from './ProgressBar.vue';
import StatusBadge from './StatusBadge.vue';
import ContributionModal from './ContributionModal.vue'; 

const props = defineProps<{
  campaign: Campaign;
}>();

const authStore = useAuthStore();
const contributionStore = useContributionStore();
const router = useRouter();

const isModalOpen = ref(false);

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

const hasContributed = computed(() => {
  return contributionStore.userContributions.some(
    (contribution) => contribution.campaign_id === props.campaign.id
  );
});

const handleBotonGenerico = () => {
  if (isOwner.value) {
    router.push(`/main/campaigns/${props.campaign.id}/edit`);
  } else {
    if (isExpired.value) {
      alert('Esta campaña ya ha finalizado y no acepta más aportes.');
      return;
    }
    isModalOpen.value = true;
  }
};

const onContributionSuccess = () => {
  alert('¡Aporte realizado con éxito!');
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
          :class="isOwner ? 'btn-edit' : (isExpired ? 'btn-disabled' : 'btn-contribute')"
          :disabled="!isOwner && isExpired"
        >
          {{ isOwner ? 'Editar' : (isExpired ? 'Cerrada' : (hasContributed ? 'Aportar más' : 'Aportar')) }}
        </button>
      </div>
    </div>

    <!-- El Modal conectado correctamente -->
    <ContributionModal 
      :is-open="isModalOpen"
      :campaign-id="campaign.id"
      :campaign-title="campaign.title"
      @close="isModalOpen = false"
      @success="onContributionSuccess"
    />
  </div>
</template>

<style scoped>
/* Contenedor principal de la tarjeta con bordes redondeados y sombra */
.campaign-card {
  background-color: #FFFFFF;
  border-radius: 16px; 
  padding: 1.5rem;
  box-shadow: 0 4px 14px rgba(64, 78, 59, 0.08);
  border: 1px solid #EAEAEA;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  /* IMPORTANTE: Solo hacemos transición de la sombra, NO usamos transform para que el modal no se rompa */
  transition: box-shadow 0.2s ease; 
}

.campaign-card:hover {
  box-shadow: 0 8px 24px rgba(64, 78, 59, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.title {
  font-size: 1.25rem;
  color: #404E3B;
  margin: 0;
  font-weight: 700;
}

.description {
  color: #6C8480;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
  flex-grow: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #F0F0F0;
}

.days-left {
  font-size: 0.85rem;
  color: #6C8480;
  font-weight: 600;
}

.action-buttons { 
  display: flex; 
  gap: 0.5rem; 
}

.btn-outline {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1.5px solid #6C8480;
  color: #6C8480;
  text-decoration: none; /* Quita la línea de abajo típica de los links */
  background-color: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-outline:hover {
  background-color: #F4F7F4;
  color: #404E3B;
  border-color: #404E3B;
}

/* Botones principales de acción */
.boton_generico { 
  padding: 0.5rem 1rem; 
  border-radius: 8px; 
  font-size: 0.85rem; 
  font-weight: 600; 
  cursor: pointer; 
  transition: all 0.2s ease; 
  border: none; 
}

.btn-edit { background-color: #6C8480; color: white; }
.btn-edit:hover { background-color: #556B68; }

.btn-contribute { background-color: #7B9669; color: white; }
.btn-contribute:hover { background-color: #617A51; }

.btn-disabled { background-color: #E6E6E6; color: #A0A0A0; cursor: not-allowed; }
</style>