import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Trips from '../views/Trips.vue'
import TripDetail from '../views/TripDetail.vue'
import Invoices from '../views/Invoices.vue'
import InvoiceDetail from '../views/InvoiceDetail.vue'
import Media from '../views/Media.vue'
import Login from '../views/Login.vue'
import Photographers from '../views/Photographers.vue'

const routes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/trips', name: 'Trips', component: Trips },
  { path: '/trips/:id', name: 'TripDetail', component: TripDetail, props: true },
  { path: '/invoices', name: 'Invoices', component: Invoices },
  { path: '/invoices/:id', name: 'InvoiceDetail', component: InvoiceDetail, props: true },
  { path: '/photographers', name: 'Photographers', component: Photographers },
  { path: '/media', name: 'Media', component: Media }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('token');

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next();
})

export default router