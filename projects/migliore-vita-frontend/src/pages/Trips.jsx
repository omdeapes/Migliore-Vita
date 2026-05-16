import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tripsApi } from '../services/api'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { useUIStore } from '../store/app'

export default function Trips() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { addToast } = useUIStore()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: () => tripsApi.list().then((r) => r.data),
  })

  const createMutation = useMutation({
    mutationFn: (tripData) => tripsApi.create(tripData),
    onSuccess: () => {
      addToast({ type: 'success', message: 'Trip created!' })
      queryClient.invalidateQueries(['trips'])
      setShowCreateModal(false)
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to create trip' })
    },
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trips</h1>
          <p className="text-gray-500 text-sm mt-1">{data?.trips?.length ?? 0} trips</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          + New Trip
        </button>
      </div>

      {/* Trips list */}
      {isLoading ? (
        <LoadingSpinner text="Loading trips..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.trips?.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
          {data?.trips?.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-400">
              No trips yet. Create the first one!
            </div>
          )}
        </div>
      )}

      {/* Create trip modal */}
      {showCreateModal && (
        <CreateTripModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={(data) => createMutation.mutate(data)}
          isLoading={createMutation.isLoading}
        />
      )}
    </div>
  )
}

function TripCard({ trip }) {
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-600',
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">🦁</span>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[trip.status] || statusColors.pending}`}>
          {trip.status?.replace('_', ' ')}
        </span>
      </div>
      <h3 className="font-bold text-gray-900 mb-1">{trip.safariCenter}</h3>
      <p className="text-sm text-gray-600 mb-2">📅 {trip.tripDate}</p>
      <p className="text-sm text-gray-600">🧭 Guide: {trip.guideName}</p>
      {trip.invoiceCount !== undefined && (
        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          {trip.invoiceCount} invoice{trip.invoiceCount !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  )
}

function CreateTripModal({ onClose, onSubmit, isLoading }) {
  const [form, setForm] = useState({
    trip_date: new Date().toISOString().split('T')[0],
    safari_center: '',
    guide_name: '',
    notes: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Create New Trip</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trip Date *</label>
            <input
              type="date"
              required
              value={form.trip_date}
              onChange={(e) => setForm({ ...form, trip_date: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Safari Center *</label>
            <input
              type="text"
              required
              placeholder="e.g., Nabq Safari Center"
              value={form.safari_center}
              onChange={(e) => setForm({ ...form, safari_center: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Guide Name *</label>
            <input
              type="text"
              required
              placeholder="e.g., Ahmed Hassan"
              value={form.guide_name}
              onChange={(e) => setForm({ ...form, guide_name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              placeholder="Any special notes..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
