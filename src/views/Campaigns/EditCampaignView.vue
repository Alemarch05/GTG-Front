<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCampaignStore } from '../../stores/campaign.store';
import { useAuthStore } from '../../stores/auth.store';

const route = useRoute();
const router = useRouter();
const campaignStore = useCampaignStore();
const authStore = useAuthStore();

const campaignId = route.params.id as string;

const form = ref({
  title: '',
  description: '',
  targetAmount: 0,
  expiresAt: ''
});

// Función auxiliar para formatear la fecha local al formato de <input type="datetime-local"> (YYYY-MM-DDTHH:mm)
const formatDateForInput = (dateString: string) => {
  if (!dateString) return '';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const isExpired = computed(() => {
  if (!campaignStore.currentCampaign?.expires_at) return false;
  return new Date(campaignStore.currentCampaign.expires_at).getTime() < new Date().getTime();
});

onMounted(async () => {
  await campaignStore.fetchCampaignById(campaignId);
  const campaign = campaignStore.currentCampaign;
  
  if (campaign) {
    form.value.title = campaign.title;
    form.value.description = campaign.description;
    form.value.targetAmount = Number(campaign.target_amount || campaign.target_amount || 0);
    form.value.expiresAt = formatDateForInput(campaign.expires_at || campaign.expires_at || '');
  }
});

const submitUpdate = async () => {
  const currentUserId = authStore.user?.id;
  
  if (!currentUserId) {
    alert('Sesión no encontrada');
    return;
  }

  // Preparamos la fecha ISO estándar
  const formattedDate = new Date(form.value.expiresAt).toISOString();

  // Payload robusto: incluye tanto camelCase como snake_case para asegurar compatibilidad con el DTO del PUT
  const payload: any = {
    userId: currentUserId,
    user_id: currentUserId,
    title: form.value.title,
    description: form.value.description,
    targetAmount: Number(form.value.targetAmount),
    target_amount: Number(form.value.targetAmount),
    expiresAt: formattedDate,
    expires_at: formattedDate
  };

  console.log('Payload enviado al PUT:', payload);

  try {
    await campaignStore.updateCampaign(campaignId, payload);
    
    // Volvemos a consultar la lista y el detalle para refrescar Pinia con la BD
    await campaignStore.fetchCampaigns();
    await campaignStore.fetchCampaignById(campaignId);
    
    // alert('¡Campaña actualizada con éxito!');
    router.push('/main/campaigns');
  } catch (error) {
    // alert('Error al guardar: ' + campaignStore.error);
    console.error('Error detallado:', error);
  }
};

const handleDelete = async () => {
  if (!confirm('¿Estás seguro de que deseas eliminar esta campaña de forma permanente?')) return;
  
  try {
    await campaignStore.deleteCampaign(campaignId);
    await campaignStore.fetchCampaigns();
    router.push('/main/campaigns');
  } catch (error) {
    console.error('Error eliminando:', error);
  }
};
</script>

<template>
  <div class="edit-container">
    <h2>Editar Campaña</h2>
    
    <div v-if="campaignStore.loading" class="loading">Cargando datos...</div>
    
    <form v-else @submit.prevent="submitUpdate" class="campaign-form">
      <div class="form-group">
        <label>Título</label>
        <input v-model="form.title" type="text" required />
      </div>

      <div class="form-group">
        <label>Descripción</label>
        <textarea v-model="form.description" required rows="4"></textarea>
      </div>

      <div class="form-group">
        <label>Nueva Meta ($)</label>
        <input v-model="form.targetAmount" type="number" required min="1" />
      </div>

      <div class="form-group">
        <label>Extender Fecha de Finalización</label>
        <input v-model="form.expiresAt" type="datetime-local" required />
      </div>

      <div class="actions">
        <div>
          <button type="button" class="btn-outline" @click="router.push('/main/campaigns')">Cancelar</button>
          <button type="submit" class="btn-primary" :disabled="campaignStore.loading">
            Guardar Cambios
          </button>
        </div>
        
        
        <button 
          v-if="isExpired" 
          type="button" 
          class="btn-danger" 
          @click="handleDelete"
        >
          🗑️ Eliminar Campaña
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.edit-container { max-width: 700px; margin: 2rem auto; padding: 2rem; background: #FFF; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
h2 { color: #404E3B; margin-bottom: 1.5rem; border-bottom: 1px solid #E6E6E6; padding-bottom: 1rem; }
.loading { text-align: center; padding: 2rem; color: #6C8480; }
.form-group { margin-bottom: 1.5rem; }
label { display: block; margin-bottom: 0.5rem; color: #404E3B; font-weight: 600; }
input, textarea { width: 100%; padding: 10px; border: 1px solid #E6E6E6; border-radius: 6px; font-family: inherit; }
.actions { display: flex; justify-content: space-between; align-items: center; margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid #E6E6E6; }
.actions div { display: flex; gap: 1rem; }
.btn-primary { background-color: #7B9669; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
.btn-outline { background: transparent; color: #6C8480; border: 1px solid #6C8480; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 600; }
.btn-danger { background-color: #D9534F; color: white; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: background 0.2s; }
.btn-danger:hover { background-color: #C9302C; }
</style>