import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { invoicesApi } from '../services/api'
import { LoadingSpinner } from '../components/common/LoadingSpinner'

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-600',
  finalized: 'bg-blue-100 text-blue-600',
  paid: 'bg-green-100 text-green-600',
}

export default function Invoices() {
  const [filters, setFilters] = useState({
    status: '',
    photographer_id: '',
    date_from: '',
    date_to: '',
    search: '',
    page: 1,
    limit: 25,
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => invoicesApi.list(filters).then((r) => r.data),
    keepPreviousData: true,
  })

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-500 text-sm mt-1">
            {data?.total ?? 0} total invoices
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            placeholder="Search by guest name or serial..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="finalized">Finalized</option>
            <option value="paid">Paid</option>
          </select>

          <input
            type="date"
            value={filters.date_from}
            onChange={(e) => setFilters({ ...filters, date_from: e.target.value, page: 1 })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="date"
            value={filters.date_to}
            onChange={(e) => setFilters({ ...filters, date_to: e.target.value, page: 1 })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <LoadingSpinner text="Loading invoices..." />
        ) : error ? (
          <div className="p-8 text-center text-red-600">
            Failed to load invoices. Please try again.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Serial #</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Guest</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Hotel</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data?.invoices?.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-gray-400">
                        No invoices found
                      </td>
                    </tr>
                  ) : (
                    data?.invoices?.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <Link
                            to={`/invoices/${invoice.id}`}
                            className="font-mono text-xs text-blue-600 hover:underline"
                          >
                            {invoice.serialNumber}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">{invoice.guestName}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{invoice.guestContact}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{invoice.guestHotel ?? '—'}</td>
                        <td className="px-4 py-3 text-sm font-bold">
                          {invoice.totalAmount?.toLocaleString()} {invoice.currency}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[invoice.status] ?? STATUS_COLORS.draft}`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(invoice.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/invoices/${invoice.id}`}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View →
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data?.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <span className="text-sm text-gray-600">
                  Page {filters.page} of {data.totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    disabled={filters.page === 1}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    disabled={filters.page >= data.totalPages}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
