<template>
  <div class="trip-detail" v-if="trip">
    <div class="header">
      <Button type="secondary" @click="goBack">← Back to Trips</Button>
      <h1>Trip Details</h1>
    </div>
    
    <div class="content">
      <div class="card" :style="glassmorphism">
        <h2>General Info</h2>
        <p><strong>Safari Center:</strong> {{ trip.safariCenter }}</p>
        <p><strong>Status:</strong> <span class="status-badge" :class="trip.status.toLowerCase()">{{ trip.status }}</span></p>
        <p><strong>Date:</strong> {{ new Date(trip.tripDate).toLocaleDateString() }}</p>
        <p><strong>Featured:</strong> {{ trip.featured ? 'Yes' : 'No' }}</p>
      </div>

      <div class="card" :style="glassmorphism">
        <h2>Logistics</h2>
        <p><strong>Guide Name:</strong> {{ trip.guideName || 'N/A' }}</p>
        <p><strong>Participants:</strong> {{ trip.participants || 0 }}</p>
        <p><strong>Trip ID:</strong> {{ trip.id }}</p>
      </div>
    </div>
  </div>
  <div v-else class="loading">
    <p>Loading trip details...</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Button from '../components/Button.vue'

export default defineComponent({
  name: 'TripDetail',
  components: { Button },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const trip = ref<any>(null)
    const glassmorphism = {
      background: 'rgba(248, 244, 230, 0.7)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(224, 224, 224, 0.3)',
    }

    const goBack = () => {
      router.push({ name: 'Trips' })
    }

    onMounted(async () => {
      try {
        const token = localStorage.getItem('token')
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://5.189.160.78:3000'
        // Assuming there is a GET /v1/admin/trips/:id endpoint
        const response = await axios.get(`${baseUrl}/v1/admin/trips/${props.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        trip.value = response.data.trip
      } catch (err) {
        console.error('Failed to load trip', err)
      }
    })

    return { trip, goBack, glassmorphism }
  }
})
</script>

<style scoped>
.trip-detail {
  padding: 1.5rem;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 2rem;
}

.content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.card {
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card h2 {
  margin-top: 0;
  color: #2A5C8A;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;
}

.card p {
  margin: 0.5rem 0;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.completed,
.status-badge.active {
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

.loading {
  padding: 2rem;
  text-align: center;
  color: #666;
}
</style>