<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useContributionStore } from '../../stores/contribution.store';

const contributionStore = useContributionStore();

onMounted(() => {
  contributionStore.fetchMyContributions();
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

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'HELD':
      return { text: 'En Custodia Virtual', class: 'badge-escrow' };
    case 'RELEASED':
      return { text: 'Entregado al Creador', class: 'badge-released' };
    case 'REFUNDED':
      return { text: 'Reembolsado', class: 'badge-refunded' };
    default:
      return { text: status || 'Desconocido', class: '' };
  }
};

// --- TOTALES Y MÉTRICAS GLOBALES DIFERENCIADAS ---

// 1. Total Histórico Aportado (suma bruta de todos los aportes)
const totalContributed = computed(() => {
  if (!Array.isArray(contributionStore.userContributions)) return 0;
  return contributionStore.userContributions.reduce(
    (total, c) => total + (Number(c.amount) || 0),
    0
  );
});

// 2. Gran Total Aportado Activo (excluyendo reembolsos)
const grandTotal = computed(() => {
  if (!Array.isArray(contributionStore.userContributions)) return 0;
  return contributionStore.userContributions
    .filter((c) => c.status !== 'REFUNDED')
    .reduce((total, c) => total + (Number(c.amount) || 0), 0);
});

// 3. Total Pendiente en Custodia Virtual
const totalPending = computed(() => {
  if (!Array.isArray(contributionStore.userContributions)) return 0;
  return contributionStore.userContributions
    .filter((c) => c.status === 'HELD')
    .reduce((total, c) => total + (Number(c.amount) || 0), 0);
});

// 4. Total Liberado al Creador (Campañas con meta lograda)
const totalReleased = computed(() => {
  if (!Array.isArray(contributionStore.userContributions)) return 0;
  return contributionStore.userContributions
    .filter((c) => c.status === 'RELEASED')
    .reduce((total, c) => total + (Number(c.amount) || 0), 0);
});

// 5. Total Reembolsado (Campañas que no alcanzaron la meta)
const totalRefunded = computed(() => {
  if (!Array.isArray(contributionStore.userContributions)) return 0;
  return contributionStore.userContributions
    .filter((c) => c.status === 'REFUNDED')
    .reduce((total, c) => total + (Number(c.amount) || 0), 0);
});

// --- AGRUPACIÓN POR CAMPAÑA (Estructura de Dev) ---
type ContributionGroup = {
  campaign_id: string;
  campaign_title: string;
  last_date: string;
  held_amount: number;
  released_amount: number;
  refunded_amount: number;
  total_amount: number;
};

const groupedContributions = computed(() => {
  const groups = new Map<string, ContributionGroup>();

  if (!Array.isArray(contributionStore.userContributions)) return [];

  contributionStore.userContributions.forEach((c) => {
    let group = groups.get(c.campaign_id);

    if (!group) {
      group = {
        campaign_id: c.campaign_id,
        campaign_title: c.campaign_title || c.campaign_id,
        last_date: c.created_at,
        held_amount: 0,
        released_amount: 0,
        refunded_amount: 0,
        total_amount: 0,
      };
      groups.set(c.campaign_id, group);
    }

    const amount = Number(c.amount) || 0;
    group.total_amount += amount;

    if (new Date(c.created_at) > new Date(group.last_date)) {
      group.last_date = c.created_at;
    }

    switch (c.status) {
      case 'HELD':
        group.held_amount += amount;
        break;
      case 'RELEASED':
        group.released_amount += amount;
        break;
      case 'REFUNDED':
        group.refunded_amount += amount;
        break;
    }
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

    <!-- Panel de Totales Diferenciados: Histórico, Pendiente, Liberado y Reembolsado -->
    <div
      v-if="groupedContributions.length > 0 && !contributionStore.loading"
      class="summary-grid"
    >
      <div class="summary-card card-total">
        <div class="card-icon">💰</div>
        <div class="card-body">
          <span class="card-title">Total Aportado</span>
          <p class="card-amount">{{ formatCurrency(totalContributed) }}</p>
          <span class="card-subtext">Histórico general</span>
        </div>
      </div>

      <div class="summary-card card-pending">
        <div class="card-icon">⏳</div>
        <div class="card-body">
          <span class="card-title">En Custodia Virtual</span>
          <p class="card-amount">{{ formatCurrency(totalPending) }}</p>
          <span class="card-subtext">Campañas activas</span>
        </div>
      </div>

      <div class="summary-card card-released">
        <div class="card-icon">✅</div>
        <div class="card-body">
          <span class="card-title">Liberado al Creador</span>
          <p class="card-amount">{{ formatCurrency(totalReleased) }}</p>
          <span class="card-subtext">Metas alcanzadas</span>
        </div>
      </div>

      <div class="summary-card card-refunded">
        <div class="card-icon">↩️</div>
        <div class="card-body">
          <span class="card-title">Reembolsado</span>
          <p class="card-amount">{{ formatCurrency(totalRefunded) }}</p>
          <span class="card-subtext">Fondos devueltos</span>
        </div>
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
            <th>En Custodia</th>
            <th>Liberado</th>
            <th>Reembolsado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in groupedContributions" :key="item.campaign_id">
            <td>{{ formatDate(item.last_date) }}</td>
            <td class="project-title">{{ item.campaign_title }}</td>
            <td class="amount text-held">{{ formatCurrency(item.held_amount) }}</td>
            <td class="amount text-released">{{ formatCurrency(item.released_amount) }}</td>
            <td class="amount text-refunded">{{ formatCurrency(item.refunded_amount) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="tfoot-row">
            <td colspan="2"><strong>Totales:</strong></td>
            <td class="amount text-held">{{ formatCurrency(totalPending) }}</td>
            <td class="amount text-released">{{ formatCurrency(totalReleased) }}</td>
            <td class="amount text-refunded">{{ formatCurrency(totalRefunded) }}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<style scoped>
.contributions-container {
  max-width: 950px;
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
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
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
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0.2rem 0;
}

.card-subtext {
  font-size: 0.75rem;
  color: #8C9E9A;
}

/* Tabla de datos */
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

.tfoot-row td {
  background-color: #F8FAF8;
  border-top: 2px solid #BAC8B1;
  border-bottom: none;
  font-size: 0.95rem;
}

.project-title {
  font-weight: 600;
  color: #404E3B;
}

.amount {
  font-weight: 600;
  white-space: nowrap;
}

.text-held {
  color: #856404;
}

.text-released {
  color: #404E3B;
}

.text-refunded {
  color: #721c24;
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
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #6C8480;
  background: #FFFFFF;
  border-radius: 8px;
  border: 1px solid #BAC8B1;
}
</style>
