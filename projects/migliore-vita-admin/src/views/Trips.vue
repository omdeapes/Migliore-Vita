<template>
  <div class="trips">
    <div class="header">
      <h1>Trips</h1>
      <div class="filters">
        <select v-model="filters.status" @change="applyFilters">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input 
          type="text" 
          v-model="filters.guide_name" 
          placeholder="Guide Name" 
          @input="applyFilters"
        />
        <input 
          type="date" 
          v-model="filters.date_start" 
          @change="applyFilters" 
          title="Start Date"
        />
        <Button type="secondary" @click="resetFilters">Reset</Button>
        <Button type="primary" @click="showCreate = true">+ New Trip</Button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreate" class="modal-overlay">
      <div class="modal-content" :style="glassmorphism">
        <h2>{{ editingTrip ? 'Edit Trip' : 'Create New Trip' }}</h2>
        <form @submit.prevent="saveTrip">
          <div class="form-group">
            <label>Date</label>
            <input type="date" v-model="form.trip_date" required />
          </div>
          <div class="form-group">
            <label>Safari Center</label>
            <input type="text" v-model="form.safari_center" required />
          </div>
          <div class="form-group">
            <label>Guide Name</label>
            <input type="text" v-model="form.guide_name" />
          </div>
          <div class="form-group">
            <label>Photographers</label>
            <select v-model="form.photographerIds" multiple class="multi-select">
              <option v-for="p in allPhotographers" :key="p.id" :value="p.id">
                {{ p.name }}
              </option>
            </select>
            <small>Hold Ctrl/Cmd to select multiple</small>
          </div>
          <div v-if="editingTrip" class="form-group">
            <label>Status</label>
            <select v-model="form.status">
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div class="modal-actions">
            <Button type="secondary" @click="closeModal">Cancel</Button>
            <Button type="primary" typeAttr="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>

    <div class="featured-trips" v-if="featuredTrips.length">
      <h2>Featured Trips</h2>
      <div class="trip-cards">
        <div
          v-for="trip in featuredTrips"
          :key="trip.id"
          class="trip-card"
          :style="glassmorphism"
        >
          <div class="trip-header">
            <h3>{{ trip.safariCenter }}</h3>
            <span class="trip-status" :class="trip.status.toLowerCase()">
              {{ trip.status }}
            </span>
          </div>
          <div class="trip-body">
            <p><strong>Date:</strong> {{ new Date(trip.tripDate).toLocaleDateString() }}</p>
            <p><strong>Guide:</strong> {{ trip.guideName || 'N/A' }}</p>
            <p><strong>Participants:</strong> {{ trip.participants || 0 }}</p>
          </div>
          <div class="trip-footer">
            <Button type="accent" @click="viewTrip(trip.id)">View Details</Button>
          </div>
        </div>
      </div>
    </div>
    <Table :columns="columns" :data="trips">
      <template #actions>
        <Button type="primary" @click="exportTrips">Export</Button>
      </template>
      <template #cell-status="{ row }">
        <span class="status-badge" :class="row.status.toLowerCase()">
          {{ row.status }}
        </span>
      </template>
      <template #cell-tripDate="{ row }">
        {{ new Date(row.tripDate).toLocaleDateString() }}
      </template>
      <template #cell-actions="{ row }">
        <div class="action-buttons">
          <Button type="accent" @click="viewTrip(row.id)">View</Button>
          <Button type="secondary" @click="editTrip(row)">Edit</Button>
          <Button type="secondary" @click="deleteTrip(row.id)">Delete</Button>
        </div>
      </template>
    </Table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Table from '../components/Table.vue'
import Button from '../components/Button.vue'

export default defineComponent({
  name: 'Trips',
  components: {
    Table,
    Button,
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const filters = reactive({
      status: '',
      guide_name: '',
      date_start: ''
    })

    const glassmorphism = {
      background: 'rgba(248, 244, 230, 0.7)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(224, 224, 224, 0.3)',
    }

    const columns = [
      { key: 'tripDate', label: 'Date' },
      { key: 'safariCenter', label: 'Safari Center' },
      { key: 'status', label: 'Status' },
      { key: 'guideName', label: 'Guide' },
      { key: 'participants', label: 'Participants' },
      { key: 'actions', label: 'Actions' },
    ]

    const applyFilters = async () => {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v !== '')
      )
      await store.dispatch('fetchTrips', activeFilters)
    }

    const resetFilters = async () => {
      filters.status = ''
      filters.guide_name = ''
      filters.date_start = ''
      await applyFilters()
    }

    const featuredTrips = computed(() => {
      return store.state.trips.filter((trip: any) => trip.featured)
    })

    const showCreate = ref(false)
    const editingTrip = ref<any>(null)
    const allPhotographers = ref<any[]>([])
    
    const form = reactive({
      trip_date: '',
      safari_center: '',
      guide_name: '',
      status: 'pending',
      photographerIds: [] as string[]
    })

    const closeModal = () => {
      showCreate.value = false
      editingTrip.value = null
      form.trip_date = ''
      form.safari_center = ''
      form.guide_name = ''
      form.status = 'pending'
      form.photographerIds = []
    }

    const editTrip = (trip: any) => {
      editingTrip.value = trip
      form.trip_date = trip.tripDate ? trip.tripDate.split('T')[0] : ''
      form.safari_center = trip.safariCenter
      form.guide_name = trip.guideName || ''
      form.status = trip.status
      form.photographerIds = trip.photographers ? trip.photographers.map((p: any) => p.id) : []
      showCreate.value = true
    }

    const loadPhotographers = async () => {
      try {
        const token = localStorage.getItem('token')
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://5.189.160.78:3000'
        const response = await axios.get(`${baseUrl}/v1/admin/photographers`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        allPhotographers.value = response.data
      } catch (err) {
        console.error('Failed to load photographers', err)
      }
    }

    const saveTrip = async () => {
      try {
        const token = localStorage.getItem('token')
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://5.189.160.78:3000'
        
        if (editingTrip.value) {
          await axios.patch(`${baseUrl}/v1/admin/trips/${editingTrip.value.id}`, {
            tripDate: form.trip_date,
            safariCenter: form.safari_center,
            guideName: form.guide_name,
            status: form.status,
            photographerIds: form.photographerIds
          }, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        } else {
          await axios.post(`${baseUrl}/v1/admin/trips`, {
            trip_date: form.trip_date,
            safari_center: form.safari_center,
            guide_name: form.guide_name,
            status: form.status,
            photographerIds: form.photographerIds
          }, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        }
        
        closeModal()
        await applyFilters()
      } catch (err) {
        console.error('Failed to save trip', err)
        alert('Failed to save trip. Please check your inputs.')
      }
    }

    const deleteTrip = async (id: string) => {
      if (!confirm('Are you sure you want to delete this trip?')) return
      try {
        const token = localStorage.getItem('token')
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://5.189.160.78:3000'
        await axios.delete(`${baseUrl}/v1/admin/trips/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        await applyFilters()
      } catch (err) {
        console.error('Failed to delete trip', err)
        alert('Failed to delete trip.')
      }
    }

    const viewTrip = (id: string) => {
      router.push({ name: 'TripDetail', params: { id } })
    }

    const exportTrips = () => {
      // Export trips logic
      console.log('Export trips')
    }

    onMounted(async () => {
      await applyFilters()
      await loadPhotographers()
    })

    return {
      trips: computed(() => store.state.trips),
      columns,
      featuredTrips,
      glassmorphism,
      viewTrip,
      exportTrips,
      filters,
      applyFilters,
      resetFilters,
      showCreate,
      editingTrip,
      form,
      allPhotographers,
      closeModal,
      saveTrip,
      editTrip,
      deleteTrip
    }
  },
})
</script>

<style scoped>
.trips {
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

.featured-trips h2 {
  margin-top: 0;
  color: #2A5C8A;
}

.trip-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.trip-card {
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s,  box-shadow 0.2s;
}

.trip-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.trip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.trip-header h3 {
  margin: 0;
  color: #2A5C8A;
}

.trip-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.trip-status.completed {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.trip-status.pending,
.trip-status.in_progress {
  background-color: rgba(255, 152, 0, 0.2);
  color: #FF9800;
}

.trip-status.cancelled {
  background-color: rgba(244, 67, 54, 0.2);
  color: #F44336;
}

.trip-body p {
  margin: 0.5rem 0;
}

.trip-footer {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.completed {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.status-badge.pending,
.status-badge.in_progress {
  background-color: rgba(255, 152, 0, 0.2);
  color: #FF9800;
}

.status-badge.cancelled {
  background-color: rgba(244, 67, 54, 0.2);
  color: #F44336;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2A5C8A;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.multi-select {
  height: auto;
  min-height: 80px;
}

small {
  color: #666;
  font-size: 0.8rem;
  margin-top: 0.2rem;
  display: block;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>