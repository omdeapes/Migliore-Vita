import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { photographersApi } from '../services/api'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { useUIStore } from '../store/app'

export default function Photographers() {
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const { addToast } = useUIStore()
  const queryClient = useQueryClient()

  const { data: photographers, isLoading, error } = useQuery({
    queryKey: ['photographers'],
    queryFn: () => photographersApi.list().then((r) => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (data) => photographersApi.create(data),
    onSuccess: () => {
      addToast({ type: 'success', message: 'Photographer created!' })
      queryClient.invalidateQueries(['photographers'])
      setShowModal(false)
    },
    onError: (err) => {
      addToast({ type: 'error', message: err.response?.data?.error || 'Failed to create photographer' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => photographersApi.update(id, data),
    onSuccess: () => {
      addToast({ type: 'success', message: 'Photographer updated!' })
      queryClient.invalidateQueries(['photographers'])
      setShowModal(false)
      setEditTarget(null)
    },
    onError: (err) => {
      addToast({ type: 'error', message: err.response?.data?.error || 'Failed to update photographer' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => photographersApi.delete(id),
    onSuccess: () => {
      addToast({ type: 'success', message: 'Photographer removed.' })
      queryClient.invalidateQueries(['photographers'])
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to delete photographer' })
    },
  })

  const handleEdit = (photographer) => {
    setEditTarget(photographer)
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditTarget(null)
  }

  const handleDelete = (photographer) => {
    if (window.confirm(`Remove ${photographer.name} from the system?`)) {
      deleteMutation.mutate(photographer.id)
    }
  }

  const handleSubmit = (formData) => {
    if (editTarget) {
      updateMutation.mutate({ id: editTarget.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Photographers</h1>
          <p className="text-gray-500 text-sm mt-1">
            {photographers?.length ?? 0} photographer{photographers?.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          + Add Photographer
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <LoadingSpinner text="Loading photographers..." />
      ) : error ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-red-500">
          Failed to load photographers. Please refresh.
        </div>
      ) : photographers?.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <div className="text-5xl mb-4">📷</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No photographers yet</h3>
          <p className="text-gray-500 text-sm mb-6">Add your first photographer to get started.</p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Add Photographer
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {photographers.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm flex-shrink-0">
                        {p.name?.charAt(0)?.toUpperCase() ?? '?'}
                      </div>
                      <span className="font-medium text-gray-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">{p.email}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                      p.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${p.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {p.lastLogin
                      ? new Date(p.lastLogin).toLocaleDateString('en-EG', { day: 'numeric', month: 'short', year: 'numeric' })
                      : <span className="text-gray-300">Never</span>}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(p)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <span className="text-gray-200">|</span>
                      <button
                        onClick={() => handleDelete(p)}
                        disabled={deleteMutation.isLoading}
                        className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <PhotographerModal
          photographer={editTarget}
          onClose={handleClose}
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
    </div>
  )
}

function PhotographerModal({ photographer, onClose, onSubmit, isLoading }) {
  const isEditing = !!photographer
  const [form, setForm] = useState({
    name: photographer?.name ?? '',
    email: photographer?.email ?? '',
    password: '',
    isActive: photographer?.isActive ?? true,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = { name: form.name, email: form.email, isActive: form.isActive }
    if (!isEditing || form.password) {
      payload.passwordHash = form.password
    }
    onSubmit(payload)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            {isEditing ? 'Edit Photographer' : 'Add New Photographer'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Ahmed Hassan"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="ahmed@migliore-vita.eg"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isEditing ? 'New Password' : 'Password *'}
              {isEditing && <span className="text-gray-400 font-normal ml-1">(leave blank to keep current)</span>}
            </label>
            <input
              type="password"
              required={!isEditing}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder={isEditing ? '••••••••' : 'Min 6 characters'}
              minLength={form.password ? 6 : undefined}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {isEditing && (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Account active (can log in)
              </label>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Photographer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
