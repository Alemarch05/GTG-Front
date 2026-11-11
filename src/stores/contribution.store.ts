import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from '../services/api';
import type {
  Contribution,
  CreateContributionDTO,
  ContributionResponse,
} from '../types/contribution.types';

export const useContributionStore = defineStore('contribution', () => {
  const userContributions = ref<Contribution[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Crear un abono/aporte a una campaña (Escrow)
  async function makeContribution(dto: CreateContributionDTO): Promise<Contribution> {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post<ContributionResponse>('/contributions', dto);
      const newContribution = response.data.data;
      userContributions.value.unshift(newContribution);
      return newContribution;
    } catch (err: any) {
      error.value = err.response?.data?.error || err.response?.data?.message || 'Error al procesar la contribución';
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  // Obtener el historial de contribuciones del usuario autenticado
  async function fetchMyContributions(): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      // Usamos 'any' para extraer la nueva estructura { total_contributed, contributions }
      const response = await api.get<any>('/contributions/me');
      
      // Extraemos específicamente el arreglo de contribuciones
      userContributions.value = response.data.data.contributions || [];
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Error al obtener las contribuciones';
    } finally {
      loading.value = false;
    }
  }

  return {
    userContributions,
    loading,
    error,
    makeContribution,
    fetchMyContributions,
  };
});