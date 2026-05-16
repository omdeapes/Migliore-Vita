import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { invoicesApi } from '../services/api'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { useUIStore } from '../store/app'

export default function InvoiceDetail() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const { addToast } = useUIStore()

  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoicesApi.get(id).then((r) => r.data),
  })

  const resendMutation = useMutation({
    mutationFn: (channel) => invoicesApi.resendDelivery(id, channel),
    onSuccess: (_, channel) => {
      addToast({ type: 'success', message: `Delivery resent via ${channel}` })
      queryClient.invalidateQueries(['invoice', id])
    },
    onError: () => {
      addToast({ type: 'error', message: 'Failed to resend delivery' })
    },
  })

  if (isLoading) return <LoadingSpinner text="Loading invoice..." />
  if (!invoice) return <div className="text-center py-12">Invoice not found</div>

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-mono">{invoice.serialNumber}</h1>
          <p className="text-gray-500 text-sm mt-1">
            Created {new Date(invoice.createdAt).toLocaleString()}
            {invoice.createdAtLocal && invoice.createdAtLocal !== invoice.createdAt &&
              ` (device time: ${new Date(invoice.createdAtLocal).toLocaleString()})`
            }
          </p>
        </div>
        <StatusBadge status={invoice.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Guest Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-bold text-gray-800 mb-4">👤 Guest Information</h2>
          <dl className="space-y-2">
            <Row label="Name" value={invoice.guestName} />
            <Row label="Contact" value={invoice.guestContact} />
            <Row label="Hotel" value={invoice.guestHotel || '—'} />
            <Row label="Room" value={invoice.guestRoom || '—'} />
          </dl>
        </div>

        {/* Payment */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-bold text-gray-800 mb-4">💰 Payment</h2>
          <dl className="space-y-2">
            <Row label="Amount" value={`${invoice.totalAmount?.toLocaleString()} ${invoice.currency}`} />
            <Row label="Status" value={invoice.status} />
            <Row label="Media Count" value={invoice.mediaCount ?? 0} />
            <Row label="Synced" value={invoice.syncedAt ? '✅ Yes' : '⏳ Pending'} />
          </dl>
        </div>
      </div>

      {/* Delivery Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="font-bold text-gray-800 mb-4">📤 Resend Delivery</h2>
        <p className="text-sm text-gray-600 mb-4">
          Manually resend the media delivery link to the guest.
        </p>
        <div className="flex flex-wrap gap-3">
          {['whatsapp', 'telegram', 'email'].map((channel) => {
            const icons = { whatsapp: '📱', telegram: '✈️', email: '📧' }
            return (
              <button
                key={channel}
                onClick={() => resendMutation.mutate(channel)}
                disabled={resendMutation.isLoading}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium capitalize transition-colors disabled:opacity-50"
              >
                {icons[channel]} {channel}
              </button>
            )
          })}
        </div>
      </div>

      {/* Media */}
      {invoice.media?.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-bold text-gray-800 mb-4">📸 Media ({invoice.media.length} files)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {invoice.media.map((item) => (
              <div
                key={item.id}
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center"
              >
                {item.mediaType === 'photo' ? (
                  <span className="text-4xl">🖼️</span>
                ) : (
                  <span className="text-4xl">🎬</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between py-1 border-b border-gray-50 last:border-0">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-sm font-medium text-gray-900">{value}</dd>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    draft: 'bg-gray-100 text-gray-700',
    finalized: 'bg-blue-100 text-blue-700',
    paid: 'bg-green-100 text-green-700',
  }
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${styles[status] || styles.draft}`}>
      {status}
    </span>
  )
}
