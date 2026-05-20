<template>
  <div class="invoices">
    <div class="header">
      <h1>Invoices</h1>
      <div class="filters">
        <select v-model="filters.status" @change="applyFilters">
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="finalized">Finalized</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input 
          type="text" 
          v-model="filters.photographer_id" 
          placeholder="Photographer ID" 
          @input="applyFilters"
        />
        <input 
          type="date" 
          v-model="filters.date_start" 
          @change="applyFilters" 
          title="Start Date"
        />
        <input 
          type="date" 
          v-model="filters.date_end" 
          @change="applyFilters" 
          title="End Date"
        />
        <Button type="secondary" @click="resetFilters">Reset</Button>
      </div>
    </div>
    <Table :columns="columns" :data="invoices">
      <template #actions>
        <Button type="primary" @click="exportInvoices">Export</Button>
      </template>
      <template #cell-status="{ row }">
        <span class="status-badge" :class="row.status.toLowerCase()">
          {{ row.status }}
        </span>
      </template>
      <template #cell-totalAmount="{ row }">
        {{ row.totalAmount }} {{ row.currency }}
      </template>
      <template #cell-createdAt="{ row }">
        {{ new Date(row.createdAtLocal || row.createdAt).toLocaleDateString() }}
      </template>
      <template #cell-actions="{ row }">
        <Button type="accent" @click="viewInvoice(row.id)">View</Button>
      </template>
    </Table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Table from '../components/Table.vue'
import Button from '../components/Button.vue'

export default defineComponent({
  name: 'Invoices',
  components: {
    Table,
    Button,
  },
  setup() {
    const store = useStore()
    const router = useRouter()

    const filters = reactive({
      status: '',
      photographer_id: '',
      date_start: '',
      date_end: ''
    })

    const columns = [
      { key: 'serialNumber', label: 'Serial Number' },
      { key: 'guestName', label: 'Guest' },
      { key: 'totalAmount', label: 'Amount' },
      { key: 'status', label: 'Status' },
      { key: 'createdAt', label: 'Date' },
      { key: 'actions', label: 'Actions' },
    ]

    const exportInvoices = () => {
      // Export invoices logic
      console.log('Export invoices')
    }

    const applyFilters = async () => {
      // Clean up empty filters before sending
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      )
      await store.dispatch('fetchInvoices', activeFilters)
    }

    const resetFilters = async () => {
      filters.status = ''
      filters.photographer_id = ''
      filters.date_start = ''
      filters.date_end = ''
      await applyFilters()
    }

    const viewInvoice = (id: string) => {
      router.push({ name: 'InvoiceDetail', params: { id } })
    }

    onMounted(async () => {
      await applyFilters()
    })

    return {
      invoices: computed(() => store.state.invoices),
      columns,
      exportInvoices,
      filters,
      applyFilters,
      resetFilters,
      viewInvoice
    }
  },
})
</script>

<style scoped>
.invoices {
  padding: 1.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filters {
  display: flex;
  gap: 10px;
  align-items: center;
}

.filters select,
.filters input {
  padding: 0.5rem;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  font-family: 'Inter', sans-serif;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.paid,
.status-badge.finalized {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.status-badge.pending,
.status-badge.draft {
  background-color: rgba(255, 152, 0, 0.2);
  color: #FF9800;
}

.status-badge.cancelled {
  background-color: rgba(244, 67, 54, 0.2);
  color: #F44336;
}
</style>