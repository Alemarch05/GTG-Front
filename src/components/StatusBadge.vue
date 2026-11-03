<script setup lang="ts">
import { computed } from 'vue';
import type { BadgeStatus } from '../types/ui.types';

const props = defineProps<{ status: BadgeStatus }>();

const badgeStyle = computed(() => {
  switch (props.status) {
    case 'ACTIVE':
    case 'HELD_IN_ESCROW':
      return { label: props.status === 'ACTIVE' ? 'Activa' : 'En Custodia', bg: '#BAC8B1', text: '#404E3B' };
    case 'SUCCESSFUL':
    case 'RELEASED':
      return { label: props.status === 'SUCCESSFUL' ? 'Exitosa' : 'Liquidado', bg: '#7B9669', text: '#E6E6E6' };
    case 'FAILED':
    case 'REFUNDED':
      return { label: props.status === 'FAILED' ? 'Fallida' : 'Reembolsado', bg: '#6C8480', text: '#E6E6E6' };
    default:
      return { label: props.status, bg: '#E6E6E6', text: '#404E3B' };
  }
});
</script>

<template>
  <span class="status-badge" :style="{ backgroundColor: badgeStyle.bg, color: badgeStyle.text }">
    {{ badgeStyle.label }}
  </span>
</template>

<style scoped>
.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  display: inline-block;
}
</style>