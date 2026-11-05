<script setup lang="ts">
import { ref } from 'vue';
import { useContributionStore } from '../stores/contribution.store';

const props = defineProps<{
  isOpen: boolean;
  campaignId: string;
  campaignTitle: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'success'): void;
}>();

const contributionStore = useContributionStore();
const amount = ref<number | null>(null);
const errorMessage = ref<string>('');

const handleSubmit = async () => {
  errorMessage.value = '';

  if (!amount.value || amount.value <= 0) {
    errorMessage.value = 'Ingresa un monto válido mayor a 0';
    return;
  }

  try {
    await contributionStore.makeContribution({
      campaign_id: props.campaignId,
      amount: amount.value,
    });
    amount.value = null;
    emit('success');
    emit('close');
  } catch (err: any) {
    errorMessage.value = err || 'No se pudo realizar el aporte';
  }
};
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
    <div class="modal-card">
      <div class="modal-header">
        <h3>Aportar al Proyecto</h3>
        <button class="btn-close" @click="emit('close')">&times;</button>
      </div>

      <p class="subtitle">{{ campaignTitle }}</p>

      <div v-if="errorMessage" class="alert-error">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleSubmit" class="form">
        <div class="form-group">
          <label for="amount">Monto a Contribuir ($)</label>
          <input
            id="amount"
            v-model.number="amount"
            type="number"
            min="1"
            placeholder="Ej: 50000"
            required
          />
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-secondary" @click="emit('close')">
            Cancelar
          </button>
          <button type="submit" :disabled="contributionStore.loading" class="btn-primary">
            {{ contributionStore.loading ? 'Procesando...' : 'Confirmar Aporte' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-card {
  background-color: #FFFFFF;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #6C8480;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 8px 24px rgba(64, 78, 59, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  color: #404E3B;
  font-size: 1.4rem;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6C8480;
  cursor: pointer;
}

.subtitle {
  color: #6C8480;
  font-size: 0.9rem;
  margin-top: 0.25rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
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
  font-size: 1rem;
  outline: none;
}

input:focus {
  border-color: #7B9669;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-secondary {
  padding: 0.6rem 1.2rem;
  background-color: transparent;
  color: #6C8480;
  border: 1px solid #6C8480;
  border-radius: 6px;
  cursor: pointer;
}

.btn-primary {
  padding: 0.6rem 1.2rem;
  background-color: #7B9669;
  color: #FFFFFF;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
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
</style>