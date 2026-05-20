<template>
  <div id="app">
    <Navbar />
    <div class="main-content">
      <Sidebar />
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'

export default defineComponent({
  name: 'App',
  components: {
    Navbar,
    Sidebar
  }
})
</script>

<style>
#app {
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #1A1A1A;
  background-color: #F8F4E6;
  min-height: 100vh;
  margin: 0;
  padding: 0;
}

.main-content {
  display: flex;
  min-height: calc(100vh - 60px); /* Adjust based on Navbar height */
}

.content {
  flex: 1;
  padding: 1.5rem;
  background-color: #F8F4E6;
}
</style>