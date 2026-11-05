<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCampaignStore } from '../../stores/campaign.store';
import ProgressBar from '../../components/ProgressBar.vue';
import StatusBadge from '../../components/StatusBadge.vue';
import LoadingSpinner from '../../components/LoadingSpinner.vue';

const route = useRoute();
const router = useRouter();
const campaignStore = useCampaignStore();

onMounted(async () => {
  // El id viene de la URL: /main/campaigns/1234
  await campaignStore.fetchCampaignById(route.params.id as string);
});
</script>

<template>
  <div class="detail-container">
    <button class="back-btn" @click="router.push('/main/campaigns')">← Volver</button>
    
    <div v-if="campaignStore.loading" class="center-content">
      <LoadingSpinner />
    </div>

    <div v-else-if="campaignStore.currentCampaign" class="campaign-detail">
      <div class="header">
        <h1>{{ campaignStore.currentCampaign.title }}</h1>
        <StatusBadge :status="campaignStore.currentCampaign.status" />
      </div>
      
      <p class="description">{{ campaignStore.currentCampaign.description }}</p>
      
      <div class="progress-section">
        <ProgressBar 
          :current-amount="Number(campaignStore.currentCampaign.current_amount) || 0" 
          :goal-amount="Number(campaignStore.currentCampaign.target_amount) || 0" 
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-container { max-width: 800px; margin: 2rem auto; padding: 2rem; background: #FFF; border-radius: 8px; border: 1px solid #E6E6E6; }
.back-btn { background: none; border: none; color: #7B9669; font-weight: bold; cursor: pointer; margin-bottom: 1.5rem; padding: 0; }
.center-content { display: flex; justify-content: center; padding: 3rem; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
h1 { color: #404E3B; margin: 0; font-size: 2rem; }
.description { color: #6C8480; line-height: 1.6; font-size: 1.1rem; margin-bottom: 2rem; }
.progress-section { background: #f9fafa; padding: 1.5rem; border-radius: 8px; border: 1px solid #E6E6E6; }
</style>