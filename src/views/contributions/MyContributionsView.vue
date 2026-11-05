<script setup lang="ts">
import { onMounted } from 'vue';
import { useContributionStore } from '../../stores/contribution.store';

const contributionStore = useContributionStore();

onMounted(() => {
  contributionStore.fetchMyContributions();
});

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val);
};

const formatDate = (dateStr: string) => {
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
      return { text: status, class: '' };
  }
};
</script>

<template>
  <div class="contributions-container">
    <div class="header">
      <h2>Mis Aportes</h2>
      <p>Seguimiento de fondos y estado de custodia virtual (All-or-Nothing)</p>
    </div>

    <div v-if="contributionStore.loading" class="loading">
      Cargando historial de aportes...
    </div>

    <div v-else-if="contributionStore.userContributions.length === 0" class="empty-state">
      <p>Aún no has realizado ningún aporte a proyectos.</p>
    </div>

    <div v-else class="table-card">
      <table class="table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>ID Proyecto / Título</th>
            <th>Monto</th>
            <th>Estado de Custodia</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in contributionStore.userContributions" :key="item.id">
            <td>{{ formatDate(item.created_at) }}</td>
            <td>{{ item.campaign_title || item.campaign_id }}</td>
            <td class="amount">{{ formatCurrency(item.amount) }}</td>
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
.contributions-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.header h2 {
  color: #404E3B;
  font-size: 2rem;
  margin-bottom: 0.25rem;
}

.header p {
  color: #6C8480;
  margin-bottom: 2rem;
}

.table-card {
  background-color: #FFFFFF;
  border: 1px solid #6C8480;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(64, 78, 59, 0.05);
}

.table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.table th {
  background-color: #BAC8B1;
  color: #404E3B;
  padding: 1rem;
  font-size: 0.9rem;
  font-weight: 700;
}

.table td {
  padding: 1rem;
  border-bottom: 1px solid #E6E6E6;
  color: #404E3B;
  font-size: 0.95rem;
}

.amount {
  font-weight: 600;
}

.badge {
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
}

.badge-escrow {
  background-color: #fff3cd;
  color: #856404;
}

.badge-released {
  background-color: #BAC8B1;
  color: #404E3B;
}

.badge-refunded {
  background-color: #f8d7da;
  color: #721c24;
}

.loading, .empty-state {
  text-align: center;
  padding: 3rem;
  color: #6C8480;
  background: #FFFFFF;
  border-radius: 8px;
  border: 1px solid #BAC8B1;
}
</style>