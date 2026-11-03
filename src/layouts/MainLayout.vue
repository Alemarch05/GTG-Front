<script setup lang="ts">
import Navbar from '../components/Navbar.vue';
import Footer from '../components/Footer.vue';
</script>

<template>
  <div class="layout-wrapper">
    <Navbar />
    <main class="main-body">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
.layout-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #E6E6E6;
}
.main-body {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  box-sizing: border-box;
}
</style>