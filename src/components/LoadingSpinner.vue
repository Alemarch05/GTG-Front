<template>
  <div class="spinner-wrapper">
    <div class="loader"></div>
  </div>
</template>

<style scoped>
.spinner-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2.5rem;
}
.loader {
  width: 40px;
  height: 40px;
  border: 4px solid #BAC8B1;
  border-top-color: #7B9669;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>