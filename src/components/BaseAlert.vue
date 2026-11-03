<script setup lang="ts">
import type { AlertType } from '../types/ui.types';
defineProps<{ type?: AlertType; message: string }>();
</script>

<template>
  <div :class="['base-alert', type || 'info']">
    <span>{{ message }}</span>
  </div>
</template>

<style scoped>
.base-alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}
.base-alert.success { background-color: #BAC8B1; color: #404E3B; }
.base-alert.error { background-color: #e2b7b7; color: #5c1d1d; }
.base-alert.info { background-color: #6C8480; color: #E6E6E6; }
</style>