<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useContributionStore } from '../../stores/contribution.store';

const contributionStore = useContributionStore();

onMounted(() => {
  contributionStore.fetchMyContributions();
});

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'HELD_IN_ESCROW':
      return { text: 'En Custodia Virtual', class: 'badge-escrow' };
    case 'RELEASED':
      return { text: 'Entregado al Creador', class: 'badge-released' };
    case 'REFUNDED':
      return { text: 'Reembolsado', class: 'badge-refunded' };
    default:
      return { text: status || 'Desconocido', class: '' };
  }
};

// 1. Calculamos el Gran Total Global
const grandTotal = computed(() => {
  return contributionStore.userContributions.reduce((total, c) => total + (Number(c.amount) || 0), 0);
});

// 2. Agrupamos por Campaña (suma los aportes si donaste varias veces al mismo proyecto)
const groupedContributions = computed(() => {
  const groups = new Map();

  contributionStore.userContributions.forEach((c) => {
    if (!groups.has(c.campaign_id)) {
      groups.set(c.campaign_id, {
        campaign_id: c.campaign_id,
        campaign_title: c.campaign_title || c.campaign_id, 
        total_amount: 0,
        status: c.status, 
        last_date: c.created_at
      });
    }
    
    const group = groups.get(c.campaign_id);
    group.total_amount += Number(c.amount) || 0;
  });

  return Array.from(groups.values());
});
</script>

<template>
  <div class="contributions-container">
    <div class="header">
      <h2>Mis Aportes</h2>
      <p>Seguimiento de fondos y estado de custodia virtual (All-or-Nothing)</p>
    </div>

    <div v-if="groupedContributions.length > 0 && !contributionStore.loading" class="summary-card">
      <div class="summary-content">
        <h3>Gran Total Aportado</h3>
        <p class="total-amount">{{ formatCurrency(grandTotal) }}</p>
      </div>
    </div>

    <div v-if="contributionStore.loading" class="loading">
      Cargando historial de aportes...
    </div>

    <div v-else-if="groupedContributions.length === 0" class="empty-state">
      <p>Aún no has realizado ningún aporte a proyectos.</p>
    </div>

    <div v-else class="table-card">
      <table class="table">
        <thead>
          <tr>
            <th>Último Aporte</th>
            <th>Proyecto</th>
            <th>Total Aportado al Proyecto</th>
            <th>Estado de Custodia</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in groupedContributions" :key="item.campaign_id">
            <td>{{ formatDate(item.last_date) }}</td>
            <td>{{ item.campaign_title }}</td>
            <td class="amount">{{ formatCurrency(item.total_amount) }}</td>
            <td>
              <span :class="['badge', getStatusBadge(item.status).class]">
                {{ getStatusBadge(item.status).text }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.contributions-container { max-width: 900px; margin: 2rem auto; padding: 0 1rem; }
.header h2 { color: #404E3B; font-size: 2rem; margin-bottom: 0.25rem; }
.header p { color: #6C8480; margin-bottom: 2rem; }
.table-card { background-color: #FFFFFF; border: 1px solid #6C8480; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(64, 78, 59, 0.05); }
.table { width: 100%; border-collapse: collapse; text-align: left; }
.table th { background-color: #BAC8B1; color: #404E3B; padding: 1rem; font-size: 0.9rem; font-weight: 700; }
.table td { padding: 1rem; border-bottom: 1px solid #E6E6E6; color: #404E3B; font-size: 0.95rem; }
.amount { font-weight: 600; }
.badge { padding: 0.35rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; display: inline-block; }
.badge-escrow { background-color: #fff3cd; color: #856404; }
.badge-released { background-color: #BAC8B1; color: #404E3B; }
.badge-refunded { background-color: #f8d7da; color: #721c24; }
.loading, .empty-state { text-align: center; padding: 3rem; color: #6C8480; background: #FFFFFF; border-radius: 8px; border: 1px solid #BAC8B1; }
.summary-card { background-color: #F4F7F4; border-left: 4px solid #7B9669; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.summary-content h3 { color: #6C8480; font-size: 1rem; margin: 0 0 0.5rem 0; font-weight: 600; }
.summary-content .total-amount { color: #404E3B; font-size: 2.2rem; font-weight: 700; margin: 0; }
</style>