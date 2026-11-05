<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCampaignStore } from '../../stores/campaign.store';
import { useAuthStore } from '../../stores/auth.store';
import CampaignCard from '../../components/CampaignCard.vue';
import LoadingSpinner from '../../components/LoadingSpinner.vue'; // Creado por Integrante 2
import BaseAlert from '../../components/BaseAlert.vue'; // Creado por Integrante 2

const campaignStore = useCampaignStore();
const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  await campaignStore.fetchCampaigns();
});
</script>

<template>
  <div class="campaigns-container">
    <header class="page-header">
      <div class="header-content">
        <div>
          <h1 class="page-title">Explorar Proyectos</h1>
          <p class="page-subtitle">Apoya iniciativas a través de custodia virtual segura.</p>
        </div>
        
        <button 
          v-if="authStore.isAuthenticated" 
          @click="router.push('/main/campaigns/create')" 
          class="btn-primary"
        >
          + Crear Campaña
        </button>
      </div>
    </header>

    <div v-if="campaignStore.loading" class="state-container">
      <LoadingSpinner />
    </div>

    <div v-else-if="campaignStore.error" class="state-container">
      <BaseAlert type="error" :message="campaignStore.error" />
    </div>

    <div v-else-if="campaignStore.campaigns.length === 0" class="state-container empty-state">
      No hay campañas activas en este momento.
    </div>

    <div v-else class="campaigns-grid">
      <CampaignCard 
        v-for="campaign in campaignStore.campaigns" 
        :key="campaign.id" 
        :campaign="campaign" 
      />
    </div>
  </div>
</template>

<style scoped>
.campaigns-container { max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem; }
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}
.page-title { color: #404E3B; font-size: 2.2rem; margin-bottom: 0.5rem; }
.page-subtitle { color: #6C8480; font-size: 1rem; }
.state-container { display: flex; justify-content: center; padding: 4rem 0; }
.empty-state { color: #6C8480; font-size: 1.1rem; text-align: center; }
.campaigns-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }

.btn-primary {
  background-color: #7B9669;
  color: #FFFFFF;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.btn-primary:hover { background-color: #617A51; }
</style>