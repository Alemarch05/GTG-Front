<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="auth-layout">
    <RouterView />
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background-color: #E6E6E6;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>