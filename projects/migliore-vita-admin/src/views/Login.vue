<template>
  <div class="login-page" :style="glassmorphism">
    <h2>Admin Login</h2>
    <form @submit='console.log("Form submitted")' @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="form.email" type="email" id="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input v-model="form.password" type="password" id="password" required minlength="6" />
      </div>
      <Button type="primary" :disabled="loading">{{ loading ? 'Logging in…' : 'Login' }}</Button>
      <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Button from '@/components/Button.vue'

export default defineComponent({
  name: 'Login',
  components: { Button },
  setup() {
    const router = useRouter()
    const form = reactive({ email: '', password: '' })
    const loading = ref(false)
    const errorMessage = ref('')
    const glassmorphism = {
      background: 'rgba(248, 244, 230, 0.7)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(224, 224, 224, 0.3)',
    }

    const handleLogin = async () => {
    console.log("Login function called with:", form);
      loading.value = true
      errorMessage.value = ''
      try {
    console.log("Sending request to:", (import.meta.env.VITE_API_BASE_URL || "") + "/v1/auth/login");
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || ''}/v1/auth/login`,
          form
        )
        console.log("Response received:", response);
        const { token, user } = response.data
        // Store token for subsequent API calls
        localStorage.setItem('token', token)
        // Optionally store user info
        localStorage.setItem('user', JSON.stringify(user))
        router.push({ name: 'Dashboard' })
      } catch (err: any) {
    console.log("Error caught:", err);
        if (err.response && err.response.data && err.response.data.error) {
          errorMessage.value = err.response.data.error
        } else {
          errorMessage.value = 'Login failed. Please try again.'
        }
      } finally {
        loading.value = false
      }
    }

    return { form, loading, errorMessage, handleLogin, glassmorphism }
  }
})
</script>

<style scoped>
.login-page {
  max-width: 400px;
  margin: 4rem auto;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-form .form-group {
  margin-bottom: 1rem;
}

.login-form label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2A5C8A;
}

.login-form input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #E0E0E0;
  border-radius: 6px;
  font-size: 1rem;
  font-family: 'Inter', sans-serif;
}

.error-msg {
  color: #F44336;
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>