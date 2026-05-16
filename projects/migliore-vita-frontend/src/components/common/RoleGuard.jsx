import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/app'

/**
 * Role-based access guard component
 * Redirects to login if not authenticated
 * Redirects to dashboard if authenticated but wrong role
 */
export function RoleGuard({ children, allowedRoles }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center h-full min-h-64">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">
            Your role ({user.role}) doesn't have permission to view this page.
          </p>
        </div>
      </div>
    )
  }

  // Children or nested routes
  return children || <Outlet />
}
