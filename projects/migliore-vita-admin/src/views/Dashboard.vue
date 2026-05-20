<template>
  <div class="dashboard">
    <h1>Dashboard</h1>
    <div class="stats-grid" v-if="stats">
      <div class="stat-card" :style="glassmorphism">
        <div class="stat-header">
          <h3>Trips Today</h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <p>{{ stats.tripsToday }}</p>
      </div>
      <div class="stat-card" :style="glassmorphism">
        <div class="stat-header">
          <h3>Active Trips</h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0z" />
            <path d="M12 7v5l3 3" />
          </svg>
        </div>
        <p>{{ stats.tripsActive }}</p>
      </div>
      <div class="stat-card" :style="glassmorphism">
        <div class="stat-header">
          <h3>Invoices Today</h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <p>{{ stats.invoicesToday }}</p>
      </div>
      <div class="stat-card" :style="glassmorphism">
        <div class="stat-header">
          <h3>Pending Invoices</h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <p>{{ stats.invoicesPending }}</p>
      </div>
      <div class="stat-card" :style="glassmorphism">
        <div class="stat-header">
          <h3>Pending Media</h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <p>{{ stats.mediaPending }}</p>
      </div>
      <div class="stat-card" :style="glassmorphism">
        <div class="stat-header">
          <h3>Revenue Today</h3>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <p>{{ stats.revenueToday }} EGP</p>
      </div>
    </div>
    <div v-else>
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading stats...</p>
      </div>
    </div>
    <div class="chart-card" :style="glassmorphism">
      <h2>Trips Overview</h2>
      <div ref="chart" class="chart-container"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import * as echarts from 'echarts'

export default defineComponent({
  name: 'Dashboard',
  setup() {
    const store = useStore()
    const chart = ref<HTMLElement | null>(null)
    let chartInstance: echarts.ECharts | null = null
    
    const glassmorphism = {
      background: 'rgba(248, 244, 230, 0.7)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(224, 224, 224, 0.3)',
    }
    
    onMounted(async () => {
      await store.dispatch('fetchStats')
      
      if (chart.value) {
        chartInstance = echarts.init(chart.value)
        const option = {
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              data: [820, 932, 901, 934, 1290, 1330, 1320],
              type: 'line',
              smooth: true,
              itemStyle: {
                color: '#2A5C8A',
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#2A5C8A' },
                  { offset: 1, color: 'rgba(42, 92, 138, 0.1)' },
                ]),
              },
            },
          ],
          tooltip: {
            trigger: 'axis',
          },
        }
        chartInstance.setOption(option)
      }
    })
    
    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.dispose()
      }
    })
    
    return {
      stats: store.state.stats,
      chart,
      glassmorphism,
    }
  },
})
</script>

<style scoped>
.dashboard {
  padding: 1.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.stat-card {
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.stat-header h3 {
  margin: 0;
  font-size: 1rem;
  color: #666;
}

.stat-card p {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  color: #2A5C8A;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #2A5C8A;
  border-top: 4px solid #4ECDC4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  margin-top: 1rem;
  color: #666;
}

.chart-card {
  margin-top: 2rem;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chart-card h2 {
  margin-top: 0;
  color: #2A5C8A;
}

.chart-container {
  height: 300px;
  width: 100%;
}
</style>