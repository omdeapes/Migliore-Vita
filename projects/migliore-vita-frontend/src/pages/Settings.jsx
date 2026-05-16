import { useAuthStore } from '../store/app'

export default function Settings() {
  const { user } = useAuthStore()

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-4">
        <h2 className="font-bold text-gray-800 mb-4">Account</h2>
        <dl className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-50">
            <dt className="text-sm text-gray-500">Name</dt>
            <dd className="text-sm font-medium">{user?.name}</dd>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <dt className="text-sm text-gray-500">Email</dt>
            <dd className="text-sm font-medium">{user?.email}</dd>
          </div>
          <div className="flex justify-between py-2">
            <dt className="text-sm text-gray-500">Role</dt>
            <dd className="text-sm font-medium capitalize">{user?.role}</dd>
          </div>
        </dl>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-bold text-gray-800 mb-4">System Info</h2>
        <dl className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-50">
            <dt className="text-sm text-gray-500">API Server</dt>
            <dd className="text-sm font-mono text-gray-700">
              {import.meta.env.VITE_API_BASE_URL || 'localhost:3000'}
            </dd>
          </div>
          <div className="flex justify-between py-2">
            <dt className="text-sm text-gray-500">Version</dt>
            <dd className="text-sm font-medium">Phase 1 MVP — v1.0.0</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
