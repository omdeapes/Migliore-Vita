import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

/**
 * Global app state using Zustand
 * Auth state persisted to localStorage for session continuity
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // Auth state
      token: null,
      user: null,
      isAuthenticated: false,

      // Actions
      login: (token, user) => set({
        token,
        user,
        isAuthenticated: true,
      }),

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false })
      },

      hasRole: (roles) => {
        const user = get().user
        if (!user) return false
        return roles.includes(user.role)
      },

      isAdmin: () => get().user?.role === 'admin',
      isAccountant: () => get().user?.role === 'accountant',
      isSupport: () => get().user?.role === 'support',
    }),
    {
      name: 'migliore-vita-auth',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

/**
 * UI state (no persistence needed)
 */
export const useUIStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  // Toast notifications
  toasts: [],
  addToast: (toast) => set((state) => ({
    toasts: [...state.toasts, { id: Date.now(), ...toast }]
  })),
  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter((t) => t.id !== id)
  })),
}))
