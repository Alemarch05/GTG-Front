<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useContributionStore } from '../../stores/contribution.store';
import { useCampaignStore } from '../../stores/campaign.store';

const contributionStore = useContributionStore();
const campaignStore = useCampaignStore();

type FilterStatus = 'ALL' | 'PENDING' | 'RELEASED' | 'REFUNDED';
const activeFilter = ref<FilterStatus>('ALL');

onMounted(() => {
  contributionStore.fetchMyContributions();
  if (campaignStore.campaigns.length === 0) {
    campaignStore.fetchCampaigns();
  }
});

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(val || 0);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getCampaignTitle = (item: any) => {
  if (item.campaign_title && item.campaign_title.trim() !== '') {
    return item.campaign_title;
  }
  const found = campaignStore.campaigns.find((c) => c.id === item.campaign_id);
  if (found && found.title) {
    return found.title;
  }
  return item.campaign_id ? `Campaña #${item.campaign_id}` : 'Proyecto';
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'HELD':
    case 'HELD_IN_ESCROW':
    case 'ACTIVE':
      return { text: 'En Custodia Virtual', class: 'badge-escrow' };
    case 'RELEASED':
    case 'SUCCESSFUL':
      return { text: 'Entregado al Creador', class: 'badge-released' };
    case 'REFUNDED':
    case 'FAILED':
      return { text: 'Reembolsado', class: 'badge-refunded' };
    default:
      return { text: status || 'En Custodia', class: 'badge-escrow' };
  }
};

// --- MÉTTRICAS DIFERENCIADAS (FRONTEND) ---

// 1. Total Histórico Aportado (Suma bruta de todos los registros de aportes)
const totalContributed = computed(() => {
  if (!Array.isArray(contributionStore.userContributions)) return 0;
  return contributionStore.userContributions.reduce(
    (acc, item) => acc + (Number(item.amount) || 0),
    0
  );
});

// 2. Total Pendiente / En Custodia Virtual (Campañas activas en evaluación All-or-Nothing)
const totalPending = computed(() => {
  if (!Array.isArray(contributionStore.userContributions)) return 0;
  return contributionStore.userContributions
    .filter((item) => ['HELD', 'HELD_IN_ESCROW', 'ACTIVE'].includes(item.status || ''))
    .reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
});

// 3. Total Liberado al Creador (Campañas que alcanzaron la meta exitosamente)
const totalReleased = computed(() => {
  if (!Array.isArray(contributionStore.userContributions)) return 0;
  return contributionStore.userContributions
    .filter((item) => ['RELEASED', 'SUCCESSFUL'].includes(item.status || ''))
    .reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
});

// 4. Total Reembolsado (Fondos devueltos al usuario porque la meta no se alcanzó)
const totalRefunded = computed(() => {
  if (!Array.isArray(contributionStore.userContributions)) return 0;
  return contributionStore.userContributions
    .filter((item) => ['REFUNDED', 'FAILED'].includes(item.status || ''))
    .reduce((acc, item) => acc + (Number(item.amount) || 0), 0);
});

// Contador de aportes por estado para los badges de los filtros
const counts = computed(() => {
  const list = contributionStore.userContributions;
  return {
    all: list.length,
    pending: list.filter((i) => ['HELD', 'HELD_IN_ESCROW', 'ACTIVE'].includes(i.status || '')).length,
    released: list.filter((i) => ['RELEASED', 'SUCCESSFUL'].includes(i.status || '')).length,
    refunded: list.filter((i) => ['REFUNDED', 'FAILED'].includes(i.status || '')).length,
  };
});

// Lista filtrada según la pestaña seleccionada
const filteredContributions = computed(() => {
  const list = contributionStore.userContributions;
  if (activeFilter.value === 'PENDING') {
    return list.filter((item) => ['HELD', 'HELD_IN_ESCROW', 'ACTIVE'].includes(item.status || ''));
  }
  if (activeFilter.value === 'RELEASED') {
    return list.filter((item) => ['RELEASED', 'SUCCESSFUL'].includes(item.status || ''));
  }
  if (activeFilter.value === 'REFUNDED') {
    return list.filter((item) => ['REFUNDED', 'FAILED'].includes(item.status || ''));
  }
  return list;
});
</script>

<template>
  <div class="contributions-container">
    <div class="header">
      <h2>Mis Aportes</h2>
      <p>Seguimiento detallado de fondos y estado de custodia virtual (All-or-Nothing)</p>
    </div>

    <!-- Panel de Métricas / Totales Claros y Diferenciados -->
    <div
      v-if="contributionStore.userContributions.length > 0 && !contributionStore.loading"
      class="summary-grid"
    >
      <!-- Total Histórico -->
      <div class="summary-card card-total">
        <div class="card-icon">💰</div>
        <div class="card-body">
          <span class="card-title">Total Aportado</span>
          <p class="card-amount">{{ formatCurrency(totalContributed) }}</p>
          <span class="card-subtext">Histórico acumulado</span>
        </div>
      </div>

      <!-- Pendiente en Custodia -->
      <div class="summary-card card-pending">
        <div class="card-icon">⏳</div>
        <div class="card-body">
          <span class="card-title">En Custodia Virtual</span>
          <p class="card-amount">{{ formatCurrency(totalPending) }}</p>
          <span class="card-subtext">Campañas activas en curso</span>
        </div>
      </div>

      <!-- Liberado / Exitoso -->
      <div class="summary-card card-released">
        <div class="card-icon">✅</div>
        <div class="card-body">
          <span class="card-title">Entregado al Creador</span>
          <p class="card-amount">{{ formatCurrency(totalReleased) }}</p>
          <span class="card-subtext">Proyectos con meta lograda</span>
        </div>
      </div>

      <!-- Reembolsado -->
      <div class="summary-card card-refunded">
        <div class="card-icon">↩️</div>
        <div class="card-body">
          <span class="card-title">Reembolsado</span>
          <p class="card-amount">{{ formatCurrency(totalRefunded) }}</p>
          <span class="card-subtext">Devuelto por meta no lograda</span>
        </div>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="contributionStore.loading" class="loading">
      Cargando historial de aportes...
    </div>

    <!-- Estado de error -->
    <div v-else-if="contributionStore.error" class="error-card">
      <p>{{ contributionStore.error }}</p>
      <button class="btn-retry" @click="contributionStore.fetchMyContributions">Reintentar</button>
    </div>

    <!-- Estado sin aportes -->
    <div v-else-if="contributionStore.userContributions.length === 0" class="empty-state">
      <p>Aún no has realizado ningún aporte a proyectos.</p>
      <router-link to="/main/campaigns" class="btn-explore">Explorar Campañas</router-link>
    </div>

    <!-- Tabla de Aportes con Filtro de Pestañas -->
    <div v-else class="table-card">
      <!-- Barra de Filtros -->
      <div class="table-filters">
        <button
          :class="['filter-btn', { active: activeFilter === 'ALL' }]"
          @click="activeFilter = 'ALL'"
        >
          Todos ({{ counts.all }})
        </button>
        <button
          :class="['filter-btn', { active: activeFilter === 'PENDING' }]"
          @click="activeFilter = 'PENDING'"
        >
          En Custodia ({{ counts.pending }})
        </button>
        <button
          :class="['filter-btn', { active: activeFilter === 'RELEASED' }]"
          @click="activeFilter = 'RELEASED'"
        >
          Entregados ({{ counts.released }})
        </button>
        <button
          :class="['filter-btn', { active: activeFilter === 'REFUNDED' }]"
          @click="activeFilter = 'REFUNDED'"
        >
          Reembolsados ({{ counts.refunded }})
        </button>
      </div>

      <!-- Mensaje si el filtro no tiene elementos -->
      <div v-if="filteredContributions.length === 0" class="empty-filter">
        No hay aportes en este estado.
      </div>

      <!-- Tabla -->
      <table v-else class="table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Proyecto / Campaña</th>
            <th>Monto</th>
            <th>Estado de Custodia</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in filteredContributions"
            :key="item.id || item.contribution_id"
          >
            <td>{{ formatDate(item.created_at) }}</td>
            <td class="campaign-cell">
              <router-link
                v-if="item.campaign_id"
                :to="`/main/campaigns/${item.campaign_id}`"
                class="campaign-link"
              >
                {{ getCampaignTitle(item) }}
              </router-link>
              <span v-else>{{ getCampaignTitle(item) }}</span>
            </td>
            <td class="amount">{{ formatCurrency(item.amount) }}</td>
            <td>
              <span :class="['badge', getStatusBadge(item.status || item.campaign_status || '').class]">
                {{ getStatusBadge(item.status || item.campaign_status || '').text }}
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
  max-width: 1000px;
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

/* Grilla de Métricas / Totales */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.summary-card {
  background-color: #FFFFFF;
  border-radius: 10px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(64, 78, 59, 0.06);
  border: 1px solid #E6E6E6;
  border-left: 5px solid #6C8480;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 78, 59, 0.12);
}

.card-total {
  border-left-color: #404E3B;
  background: linear-gradient(135deg, #FFFFFF 0%, #F4F7F4 100%);
}

.card-pending {
  border-left-color: #E0A800;
  background: linear-gradient(135deg, #FFFFFF 0%, #FFFDF5 100%);
}

.card-released {
  border-left-color: #7B9669;
  background: linear-gradient(135deg, #FFFFFF 0%, #F6FAF4 100%);
}

.card-refunded {
  border-left-color: #D9534F;
  background: linear-gradient(135deg, #FFFFFF 0%, #FFF6F6 100%);
}

.card-icon {
  font-size: 1.8rem;
  line-height: 1;
}

.card-body {
  display: flex;
  flex-direction: column;
}

.card-title {
  color: #6C8480;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-amount {
  color: #404E3B;
  font-size: 1.45rem;
  font-weight: 700;
  margin: 0.2rem 0;
}

.card-subtext {
  font-size: 0.75rem;
  color: #8C9E9A;
}

/* Filtros de la Tabla */
.table-filters {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background-color: #F8FAF8;
  border-bottom: 1px solid #E6E6E6;
  flex-wrap: wrap;
}

.filter-btn {
  background: transparent;
  border: 1px solid #BAC8B1;
  color: #404E3B;
  padding: 0.4rem 0.85rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background-color: #BAC8B1;
  color: #404E3B;
}

.filter-btn.active {
  background-color: #7B9669;
  color: #FFFFFF;
  border-color: #7B9669;
}

.empty-filter {
  padding: 2.5rem;
  text-align: center;
  color: #6C8480;
  font-style: italic;
}

/* Tabla de datos */
.table-card {
  background-color: #FFFFFF;
  border: 1px solid #BAC8B1;
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

.table tr:last-child td {
  border-bottom: none;
}

.campaign-cell .campaign-link {
  color: #404E3B;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.2s ease;
}

.campaign-cell .campaign-link:hover {
  color: #7B9669;
  text-decoration: underline;
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

.loading,
.empty-state,
.error-card {
  text-align: center;
  padding: 3rem;
  color: #6C8480;
  background: #FFFFFF;
  border-radius: 8px;
  border: 1px solid #BAC8B1;
}

.empty-state p {
  margin-bottom: 1rem;
}

.btn-explore {
  display: inline-block;
  padding: 0.5rem 1.25rem;
  background-color: #7B9669;
  color: #FFFFFF;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s;
}

.btn-explore:hover {
  background-color: #617A51;
}

.btn-retry {
  padding: 0.5rem 1rem;
  background-color: #6C8480;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 0.5rem;
}

.btn-retry:hover {
  background-color: #556B68;
}
</style>
