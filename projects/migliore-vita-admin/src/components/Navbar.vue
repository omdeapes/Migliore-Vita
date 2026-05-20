<template>
  <nav class="navbar">
    <div class="navbar-left">
      <div class="navbar-brand">
        <h1>Migliore Vita</h1>
      </div>
    </div>
    <div class="navbar-center">
      <div class="search-bar">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input type="text" placeholder="Search..." />
      </div>
    </div>
    <div class="navbar-right">
      <div class="user-profile">
        <button class="profile-btn" @click="toggleDropdown">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
        <div v-if="showDropdown" class="dropdown-menu">
          <ul>
            <li><button @click="logout">Logout</button></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'Navbar',
  setup() {
    const showDropdown = ref(false)
    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value
    }
    const logout = () => {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return {
      showDropdown,
      toggleDropdown,
      logout
    }
  }
})
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background-color: white;
  color: #1A1A1A;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: 60px;
}

.navbar-left, .navbar-right {
  display: flex;
  align-items: center;
}

.navbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.navbar-brand h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2A5C8A;
}

.search-bar {
  display: flex;
  align-items: center;
  background-color: #F0F0F0;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  width: 100%;
  max-width: 400px;
}

.search-bar svg {
  margin-right: 0.5rem;
  color: #666;
}

.search-bar input {
  border: none;
  background: none;
  outline: none;
  width: 100%;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
}

.user-profile {
  position: relative;
}

.profile-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.2s;
}

.profile-btn:hover {
  background: #F0F0F0;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 0;
  min-width: 120px;
  z-index: 100;
}

.dropdown-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-menu li {
  padding: 0.5rem 1rem;
}

.dropdown-menu button {
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #1A1A1A;
}

.dropdown-menu button:hover {
  background: #F0F0F0;
}
</style>