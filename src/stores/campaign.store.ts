import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '../services/api';
import type { Campaign, CreateCampaignDTO, UpdateCampaignDTO } from '../types/campaign.types';

export const useCampaignStore = defineStore('campaign', () => {
  const campaigns = ref<Campaign[]>([]);
  const currentCampaign = ref<Campaign | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  async function fetchCampaigns() {
    loading.value = true;
    error.value = null;
    try {
      // Consume el endpoint público de campañas
      const response = await api.get('/campaigns');
      campaigns.value = response.data;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar las campañas';
    } finally {
      loading.value = false;
    }
  }

  async function fetchCampaignById(id: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get(`/campaigns/${id}`);
      currentCampaign.value = response.data;
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al cargar la campaña';
    } finally {
      loading.value = false;
    }
  }

  async function createCampaign(campaignData: CreateCampaignDTO) {
    loading.value = true;
    error.value = null;
    try {
      // El token ya se envía automáticamente gracias al interceptor del integrante 1
      await api.post('/campaigns', campaignData);
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al crear la campaña';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }
  async function updateCampaign(id: string, campaignData: UpdateCampaignDTO) {
    loading.value = true;
    error.value = null;
    try {
      await api.put(`/campaigns/${id}`, campaignData);
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al actualizar la campaña';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function deleteCampaign(id: string) {
    loading.value = true;
    error.value = null;
    try {
      await api.delete(`/campaigns/${id}`);
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al eliminar la campaña';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  return {
    campaigns,
    currentCampaign,
    loading,
    error,
    fetchCampaigns,
    fetchCampaignById,
    createCampaign,
    updateCampaign,
    deleteCampaign
  };
});