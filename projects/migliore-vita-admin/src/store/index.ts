import { createStore } from 'vuex'
import axios from 'axios'

const store = createStore({
  state: {
    stats: {},
    trips: [],
    invoices: [],
    media: []
  },
  mutations: {
    SET_STATS(state, stats) {
      state.stats = stats
    },
    SET_TRIPS(state, trips) {
      state.trips = trips
    },
    SET_INVOICES(state, invoices) {
      state.invoices = invoices
    },
    SET_MEDIA(state, media) {
      state.media = media
    }
  },
  actions: {
    async fetchStats({ commit }) {
      const response = await axios.get('http://5.189.160.78:3000/v1/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      commit('SET_STATS', response.data)
    },
    async fetchTrips({ commit }, filters = {}) {
      const token = localStorage.getItem('token')
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://5.189.160.78:3000'
      const response = await axios.get(`${baseUrl}/v1/admin/trips`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: filters
      })
      commit('SET_TRIPS', response.data.trips)
    },
    async fetchInvoices({ commit }, filters = {}) {
      const token = localStorage.getItem('token')
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://5.189.160.78:3000'
      const response = await axios.get(`${baseUrl}/v1/admin/invoices`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: filters
      })
      commit('SET_INVOICES', response.data.invoices)
    },
    async fetchMedia({ commit }) {
      const response = await axios.get('http://5.189.160.78:3000/v1/admin/media', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      commit('SET_MEDIA', response.data.media)
    }
  }
})

export default store