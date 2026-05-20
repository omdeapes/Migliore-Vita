<template>
  <div class="invoice-detail" v-if="invoice">
    <div class="header">
      <Button type="secondary" @click="goBack">← Back to Invoices</Button>
      <h1>Invoice Details</h1>
    </div>
    
    <div class="content">
      <div class="card" :style="glassmorphism">
        <h2>General Info</h2>
        <p><strong>Serial Number:</strong> {{ invoice.serialNumber }}</p>
        <p><strong>Status:</strong> <span class="status-badge" :class="invoice.status.toLowerCase()">{{ invoice.status }}</span></p>
        <p><strong>Total Amount:</strong> {{ invoice.totalAmount }} {{ invoice.currency }}</p>
        <p><strong>Date:</strong> {{ new Date(invoice.createdAtLocal || invoice.createdAt).toLocaleString() }}</p>
      </div>

      <div class="card" :style="glassmorphism">
        <h2>Guest Info</h2>
        <p><strong>Name:</strong> {{ invoice.guestName }}</p>
        <p><strong>Contact:</strong> {{ invoice.guestContact }}</p>
        <p><strong>Hotel:</strong> {{ invoice.guestHotel || 'N/A' }}</p>
        <p><strong>Room:</strong> {{ invoice.guestRoom || 'N/A' }}</p>
      </div>

      <div class="card" :style="glassmorphism">
        <h2>System Data</h2>
        <p><strong>Invoice ID:</strong> {{ invoice.id }}</p>
        <p><strong>Trip ID:</strong> {{ invoice.tripId }}</p>
        <p><strong>Photographer ID:</strong> {{ invoice.photographerId }}</p>
        <p><strong>Device ID:</strong> {{ invoice.deviceId || 'N/A' }}</p>
      </div>
    </div>

    <div class="media-section" v-if="invoice.Media && invoice.Media.length">
      <h2>Media Attached ({{ invoice.Media.length }})</h2>
      <div class="media-grid">
        <div v-for="m in invoice.Media" :key="m.id" class="media-item">
          <p><strong>Type:</strong> {{ m.mediaType }}</p>
          <p><strong>Name:</strong> {{ m.fileName }}</p>
          <p><strong>Size:</strong> {{ (m.fileSize / 1024 / 1024).toFixed(2) }} MB</p>
          <p><strong>Status:</strong> {{ m.uploadStatus }}</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">
    <p>Loading invoice details...</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Button from '../components/Button.vue'

export default defineComponent({
  name: 'InvoiceDetail',
  components: { Button },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const invoice = ref<any>(null)
    const glassmorphism = {
      background: 'rgba(248, 244, 230, 0.7)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(224, 224, 224, 0.3)',
    }

    const goBack = () => {
      router.push({ name: 'Invoices' })
    }

    onMounted(async () => {
      try {
        const token = localStorage.getItem('token')
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://5.189.160.78:3000'
        const response = await axios.get(`${baseUrl}/v1/invoices/${props.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        invoice.value = response.data.invoice
      } catch (err) {
        console.error('Failed to load invoice', err)
      }
    })

    return { invoice, goBack, glassmorphism }
  }
})
</script>

<style scoped>
.invoice-detail {
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

.media-section {
  margin-top: 2rem;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.media-item {
  padding: 1rem;
  border-radius: 8px;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
}

.loading {
  padding: 2rem;
  text-align: center;
  color: #666;
}
</style>