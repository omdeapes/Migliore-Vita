import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../services/api'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { useAuthStore } from '../store/app'

export default function Dashboard() {
  const { user } = useAuthStore()

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats().then((r) => r.data),
    refetchInterval: 60000, // Refresh every minute
  })

  if (isLoading) return <LoadingSpinner text="Loading dashboard..." />

  const cards = [
    {
      icon: '🦁',
      label: "Today's Trips",
      value: stats?.tripsToday ?? '—',
      sub: `${stats?.tripsActive ?? 0} active`,
      color: 'bg-amber-50 border-amber-200',
      textColor: 'text-amber-700',
    },
    {
      icon: '🧾',
      label: 'Invoices Today',
      value: stats?.invoicesToday ?? '—',
      sub: `${stats?.invoicesPending ?? 0} pending`,
      color: 'bg-blue-50 border-blue-200',
      textColor: 'text-blue-700',
    },
    {
      icon: '📸',
      label: 'Media Pending',
      value: stats?.mediaPending ?? '—',
      sub: 'Awaiting delivery',
      color: 'bg-purple-50 border-purple-200',
      textColor: 'text-purple-700',
    },
    {
      icon: '💰',
      label: "Today's Revenue",
      value: stats?.revenueToday ? `${stats.revenueToday.toLocaleString()} EGP` : '—',
      sub: 'Across all photographers',
      color: 'bg-green-50 border-green-200',
      textColor: 'text-green-700',
    },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Good{getGreeting()}, {user?.name?.split(' ')[0] ?? 'Admin'}! 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Here's what's happening at Migliore Vita today.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`border rounded-xl p-5 ${card.color}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
            </div>
            <div className={`text-3xl font-bold ${card.textColor} mb-1`}>
              {card.value}
            </div>
            <div className="text-sm text-gray-600 font-medium">{card.label}</div>
            <div className="text-xs text-gray-500 mt-1">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-800 mb-4">Recent Invoices</h2>
          {stats?.recentInvoices?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentInvoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <div className="text-sm font-medium">{inv.guestName}</div>
                    <div className="text-xs text-gray-500">{inv.serialNumber}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{inv.totalAmount} EGP</div>
                    <StatusBadge status={inv.status} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">No invoices yet today</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-bold text-gray-800 mb-4">Sync Status</h2>
          <div className="space-y-3">
            <SyncRow
              label="Invoices synced"
              count={stats?.invoicesSynced ?? 0}
              total={stats?.invoicesTotal ?? 0}
              color="blue"
            />
            <SyncRow
              label="Media uploaded"
              count={stats?.mediaUploaded ?? 0}
              total={stats?.mediaTotal ?? 0}
              color="purple"
            />
            <SyncRow
              label="Deliveries sent"
              count={stats?.deliveriesSent ?? 0}
              total={stats?.invoicesToday ?? 0}
              color="green"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    draft: 'bg-gray-100 text-gray-600',
    finalized: 'bg-blue-100 text-blue-600',
    paid: 'bg-green-100 text-green-600',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status] || styles.draft}`}>
      {status}
    </span>
  )
}

function SyncRow({ label, count, total, color }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  const barColors = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    green: 'bg-green-500',
  }

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{count}/{total}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColors[color]} rounded-full transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}
