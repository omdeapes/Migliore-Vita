import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from './store/app'
import AppLayout from './components/layout/AppLayout'
import { RoleGuard } from './components/common/RoleGuard'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Trips from './pages/Trips'
import Invoices from './pages/Invoices'
import InvoiceDetail from './pages/InvoiceDetail'
import Media from './pages/Media'
import Photographers from './pages/Photographers'
import Payouts from './pages/Payouts'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
})

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route
              path="trips"
              element={
                <RoleGuard allowedRoles={['admin', 'accountant', 'support']}>
                  <Trips />
                </RoleGuard>
              }
            />
            <Route
              path="invoices"
              element={
                <RoleGuard allowedRoles={['admin', 'accountant', 'support']}>
                  <Invoices />
                </RoleGuard>
              }
            />
            <Route
              path="invoices/:id"
              element={
                <RoleGuard allowedRoles={['admin', 'accountant', 'support']}>
                  <InvoiceDetail />
                </RoleGuard>
              }
            />
            <Route
              path="media"
              element={
                <RoleGuard allowedRoles={['admin', 'support']}>
                  <Media />
                </RoleGuard>
              }
            />
            <Route
              path="photographers"
              element={
                <RoleGuard allowedRoles={['admin']}>
                  <Photographers />
                </RoleGuard>
              }
            />
            <Route
              path="payouts"
              element={
                <RoleGuard allowedRoles={['admin', 'accountant']}>
                  <Payouts />
                </RoleGuard>
              }
            />
            <Route
              path="reports"
              element={
                <RoleGuard allowedRoles={['admin', 'accountant']}>
                  <Reports />
                </RoleGuard>
              }
            />
            <Route
              path="settings"
              element={
                <RoleGuard allowedRoles={['admin']}>
                  <Settings />
                </RoleGuard>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}
