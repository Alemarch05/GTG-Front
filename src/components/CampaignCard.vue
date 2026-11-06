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
.action-buttons { display: flex; gap: 0.5rem; }
.boton_generico { padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s ease; border: none; }
.btn-edit { background-color: #6C8480; color: white; }
.btn-edit:hover { background-color: #556B68; }
.btn-contribute { background-color: #7B9669; color: white; }
.btn-contribute:hover { background-color: #617A51; }
.btn-disabled { background-color: #E6E6E6; color: #A0A0A0; cursor: not-allowed; }
</style>