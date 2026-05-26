import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { reportsApi } from '../services/api'
import { LoadingSpinner } from '../components/common/LoadingSpinner'

const PERIODS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

function getDefaultDates() {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - 29)
  return {
    from: from.toISOString().split('T')[0],
    to: to.toISOString().split('T')[0],
  }
}

export default function Reports() {
  const defaults = getDefaultDates()
  const [filters, setFilters] = useState({
    period: 'daily',
    date_from: defaults.from,
    date_to: defaults.to,
    status: '',
    currency: '',
  })

  const { data: revenue, isLoading: loadingRevenue } = useQuery({
    queryKey: ['reports-revenue', filters],
    queryFn: () => reportsApi.revenue(filters).then((r) => r.data),
    keepPreviousData: true,
  })

  const { data: photographers, isLoading: loadingPhotographers } = useQuery({
    queryKey: ['reports-photographers', filters],
    queryFn: () => reportsApi.photographers({
      date_from: filters.date_from,
      date_to: filters.date_to,
      status: filters.status,
    }).then((r) => r.data),
    keepPreviousData: true,
  })

  const totalRevenue = revenue?.totals?.reduce((sum, t) => sum + parseFloat(t.total || 0), 0) ?? 0
  const totalInvoices = revenue?.totals?.reduce((sum, t) => sum + parseInt(t.count || 0), 0) ?? 0

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Revenue Reports</h1>
        <p className="text-gray-500 text-sm mt-1">Track earnings, invoices, and photographer performance.</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Period</label>
            <select
              value={filters.period}
              onChange={(e) => setFilters({ ...filters, period: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PERIODS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
            <input
              type="date"
              value={filters.date_from}
              onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
            <input
              type="date"
              value={filters.date_to}
              onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="draft">Draft</option>
              <option value="finalized">Finalized</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Currency</label>
            <select
              value={filters.currency}
              onChange={(e) => setFilters({ ...filters, currency: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="EGP">EGP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SummaryCard
          icon="💰"
          label="Total Revenue"
          value={`${totalRevenue.toLocaleString('en-EG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} EGP`}
          color="bg-green-50 border-green-200 text-green-700"
        />
        <SummaryCard
          icon="🧾"
          label="Total Invoices"
          value={totalInvoices.toString()}
          color="bg-blue-50 border-blue-200 text-blue-700"
        />
        <SummaryCard
          icon="📸"
          label="Photographers Active"
          value={(photographers?.photographers?.length ?? 0).toString()}
          color="bg-purple-50 border-purple-200 text-purple-700"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Over Time */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-bold text-gray-800 mb-4">Revenue Over Time</h2>
          {loadingRevenue ? (
            <LoadingSpinner size="sm" text="Loading..." />
          ) : revenue?.rows?.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No data for this period</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {revenue?.rows?.map((row, i) => {
                const maxVal = Math.max(...(revenue.rows.map(r => parseFloat(r.total || 0))))
                const pct = maxVal > 0 ? (parseFloat(row.total || 0) / maxVal) * 100 : 0
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span className="font-medium">{row.period}</span>
                      <span>
                        <span className="font-bold text-gray-900">
                          {parseFloat(row.total || 0).toLocaleString()}
                        </span>
                        {' '}{row.currency || 'EGP'}
                        <span className="text-gray-400 ml-2">({row.count} inv.)</span>
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Photographer Breakdown */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="font-bold text-gray-800 mb-4">By Photographer</h2>
          {loadingPhotographers ? (
            <LoadingSpinner size="sm" text="Loading..." />
          ) : photographers?.photographers?.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-8">No data for this period</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {photographers?.photographers?.map((p, i) => {
                const maxVal = Math.max(...(photographers.photographers.map(x => parseFloat(x.total_revenue || 0))))
                const pct = maxVal > 0 ? (parseFloat(p.total_revenue || 0) / maxVal) * 100 : 0
                const colors = ['bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-pink-500', 'bg-teal-500']
                return (
                  <div key={i}>
                    <div className="flex justify-between items-center text-sm mb-1">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                          {p.photographer_name?.charAt(0) ?? '?'}
                        </div>
                        <span className="font-medium text-gray-800">{p.photographer_name ?? 'Unknown'}</span>
                      </div>
                      <div className="text-right text-xs">
                        <div className="font-bold text-gray-900">
                          {parseFloat(p.total_revenue || 0).toLocaleString()} EGP
                        </div>
                        <div className="text-gray-400">{p.invoice_count} invoices</div>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[i % colors.length]} rounded-full transition-all`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Revenue by Currency Table */}
      {revenue?.totals?.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mt-6">
          <h2 className="font-bold text-gray-800 mb-4">Totals by Currency</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-xs font-semibold text-gray-500 uppercase">Currency</th>
                  <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">Invoices</th>
                  <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">Total Revenue</th>
                  <th className="text-right py-2 text-xs font-semibold text-gray-500 uppercase">Avg per Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {revenue.totals.map((t, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="py-3 font-medium">{t.currency}</td>
                    <td className="py-3 text-right text-gray-600">{t.count}</td>
                    <td className="py-3 text-right font-bold">
                      {parseFloat(t.total || 0).toLocaleString('en-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 text-right text-gray-600">
                      {t.count > 0
                        ? (parseFloat(t.total || 0) / parseInt(t.count)).toLocaleString('en-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function SummaryCard({ icon, label, value, color }) {
  return (
    <div className={`border rounded-xl p-5 ${color}`}>
      <div className="text-2xl mb-3">{icon}</div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm font-medium opacity-80">{label}</div>
    </div>
  )
}
