<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  currentAmount: number;
  goalAmount: number;
}>();

const percentage = computed(() => {
  if (props.goalAmount === 0) return 0;
  const rawPercent = (props.currentAmount / props.goalAmount) * 100;
  return Math.min(rawPercent, 100); // Topamos al 100% visualmente
});
</script>

<template>
  <div class="progress-wrapper">
    <div class="progress-info">
      <span class="amount">${{ currentAmount.toLocaleString() }} recolectados</span>
      <span class="percentage">{{ percentage.toFixed(1) }}%</span>
    </div>
    <div class="progress-background">
      <div class="progress-fill" :style="{ width: `${percentage}%` }"></div>
    </div>
    <div class="goal">Meta: ${{ goalAmount.toLocaleString() }}</div>
  </div>
</template>

<style scoped>
.progress-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin: 1rem 0;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #404E3B;
  font-weight: 600;
}

.progress-background {
  height: 8px;
  background-color: #BAC8B1; /* Verde menta claro */
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #7B9669; /* Verde olivo */
  transition: width 0.4s ease;
}

.goal {
  font-size: 0.8rem;
  color: #6C8480; /* Verde grisáceo */
  text-align: right;
}
</style>