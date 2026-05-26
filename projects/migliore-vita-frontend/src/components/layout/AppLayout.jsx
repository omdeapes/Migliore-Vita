import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore, useUIStore } from '../../store/app'

const navItems = [
  { path: '/dashboard', icon: '📊', label: 'Dashboard', roles: ['admin', 'accountant', 'support'] },
  { path: '/trips', icon: '🦁', label: 'Trips', roles: ['admin'] },
  { path: '/invoices', icon: '🧾', label: 'Invoices', roles: ['admin', 'accountant', 'support'] },
  { path: '/media', icon: '📸', label: 'Media', roles: ['admin', 'support'] },
  { path: '/photographers', icon: '🎞️', label: 'Photographers', roles: ['admin'] },
  { path: '/payouts', icon: '💸', label: 'Payouts', roles: ['admin', 'accountant'] },
  { path: '/reports', icon: '📈', label: 'Reports', roles: ['admin', 'accountant'] },
  { path: '/settings', icon: '⚙️', label: 'Settings', roles: ['admin'] },
]

export default function AppLayout() {
  const { user, logout } = useAuthStore()
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const location = useLocation()
  const navigate = useNavigate()

  const visibleItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user?.role)
  )

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } bg-blue-900 text-white flex flex-col transition-all duration-300`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-blue-800">
          <span className="text-2xl">📷</span>
          {sidebarOpen && (
            <div>
              <div className="font-bold text-sm leading-tight">Migliore Vita</div>
              <div className="text-blue-300 text-xs">Admin Dashboard</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {visibleItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg mb-1 transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-200 hover:bg-blue-800 hover:text-white'
              }`}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="border-t border-blue-800 p-4">
          {sidebarOpen && user && (
            <div className="mb-3">
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-blue-300 capitalize">{user.role}</div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-blue-300 hover:text-white text-sm transition-colors"
          >
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            ☰
          </button>
          <div className="flex-1" />
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString('en-EG', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
