<template>
  <div class="photographers">
    <div class="header">
      <h1>Photographers</h1>
      <div class="filters">
        <Button type="primary" @click="showCreate = true">+ New Photographer</Button>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showCreate" class="modal-overlay">
      <div class="modal-content" :style="glassmorphism">
        <h2>{{ editingUser ? 'Edit Photographer' : 'Create New Photographer' }}</h2>
        <form @submit.prevent="savePhotographer">
          <div class="form-group">
            <label>Name</label>
            <input type="text" v-model="form.name" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" v-model="form.email" required />
          </div>
          <div v-if="!editingUser" class="form-group">
            <label>Password</label>
            <input type="password" v-model="form.passwordHash" required />
          </div>
          <div class="form-group">
            <label>Status (isActive)</label>
            <select v-model="form.isActive">
              <option :value="true">Active</option>
              <option :value="false">Inactive</option>
            </select>
          </div>
          <div class="modal-actions">
            <Button type="secondary" @click="closeModal">Cancel</Button>
            <Button type="primary" typeAttr="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>

    <Table :columns="columns" :data="photographers">
      <template #cell-isActive="{ row }">
        <span class="status-badge" :class="row.isActive ? 'active' : 'inactive'">
          {{ row.isActive ? 'Active' : 'Inactive' }}
        </span>
      </template>
      <template #cell-actions="{ row }">
        <div class="action-buttons">
          <Button type="secondary" @click="editPhotographer(row)">Edit</Button>
          <Button type="secondary" @click="deletePhotographer(row.id)">Delete</Button>
        </div>
      </template>
    </Table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import axios from 'axios'
import Table from '../components/Table.vue'
import Button from '../components/Button.vue'

export default defineComponent({
  name: 'Photographers',
  components: {
    Table,
    Button,
  },
  setup() {
    const photographers = ref<any[]>([])
    const showCreate = ref(false)
    const editingUser = ref<any>(null)

    const form = reactive({
      name: '',
      email: '',
      passwordHash: '',
      isActive: true
    })

    const columns = [
      { key: 'name', label: 'Name' },
      { key: 'email', label: 'Email' },
      { key: 'isActive', label: 'Status' },
      { key: 'actions', label: 'Actions' },
    ]

    const glassmorphism = {
      background: 'rgba(248, 244, 230, 0.7)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(224, 224, 224, 0.3)',
    }

    const loadPhotographers = async () => {
      try {
        const token = localStorage.getItem('token')
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://5.189.160.78:3000'
        const response = await axios.get(`${baseUrl}/v1/admin/photographers`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        photographers.value = response.data
      } catch (err) {
        console.error('Failed to load photographers', err)
      }
    }

    const closeModal = () => {
      showCreate.value = false
      editingUser.value = null
      form.name = ''
      form.email = ''
      form.passwordHash = ''
      form.isActive = true
    }

    const editPhotographer = (user: any) => {
      editingUser.value = user
      form.name = user.name
      form.email = user.email
      form.passwordHash = ''
      form.isActive = user.isActive
      showCreate.value = true
    }

    const savePhotographer = async () => {
      try {
        const token = localStorage.getItem('token')
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://5.189.160.78:3000'
        
        const payload: any = {
          name: form.name,
          email: form.email,
          isActive: form.isActive
        }
        
        if (!editingUser.value) {
          payload.passwordHash = form.passwordHash
          await axios.post(`${baseUrl}/v1/admin/photographers`, payload, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        } else {
          await axios.patch(`${baseUrl}/v1/admin/photographers/${editingUser.value.id}`, payload, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        }
        
        closeModal()
        await loadPhotographers()
      } catch (err) {
        console.error('Failed to save photographer', err)
        alert('Failed to save photographer. Please check your inputs.')
      }
    }

    const deletePhotographer = async (id: string) => {
      if (!confirm('Are you sure you want to delete this photographer?')) return
      try {
        const token = localStorage.getItem('token')
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://5.189.160.78:3000'
        await axios.delete(`${baseUrl}/v1/admin/photographers/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        await loadPhotographers()
      } catch (err) {
        console.error('Failed to delete photographer', err)
        alert('Failed to delete photographer.')
      }
    }

    onMounted(async () => {
      await loadPhotographers()
    })

    return {
      photographers,
      columns,
      glassmorphism,
      showCreate,
      editingUser,
      form,
      closeModal,
      savePhotographer,
      editPhotographer,
      deletePhotographer
    }
  }
})
</script>

<style scoped>
.photographers {
  padding: 1.5rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.active {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.status-badge.inactive {
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

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>