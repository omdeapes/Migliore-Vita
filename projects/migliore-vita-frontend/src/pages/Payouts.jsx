import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { payoutsApi, invoicesApi } from '../services/api'
import { LoadingSpinner } from '../components/common/LoadingSpinner'

const METHODS = ['cash', 'bank_transfer', 'card', 'other']
const METHOD_LABELS = {
  cash: 'Cash',
  bank_transfer: 'Bank Transfer',
  card: 'Card',
  other: 'Other',
}
const METHOD_COLORS = {
  cash: 'bg-green-100 text-green-700',
  bank_transfer: 'bg-blue-100 text-blue-700',
  card: 'bg-purple-100 text-purple-700',
  other: 'bg-gray-100 text-gray-600',
}

function today() {
  return new Date().toISOString().split('T')[0]
}
function monthAgo() {
  const d = new Date()
  d.setDate(d.getDate() - 30)
  return d.toISOString().split('T')[0]
}

const EMPTY_FORM = {
  invoice_serial: '',
  invoice_id: '',
  amount_paid: '',
  currency: 'EGP',
  payment_method: 'cash',
  payment_reference: '',
  notes: '',
  paid_at: today(),
}

export default function Payouts() {
  const qc = useQueryClient()
  const [filters, setFilters] = useState({ from: monthAgo(), to: today(), method: '', page: 1 })
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [invoiceSearch, setInvoiceSearch] = useState('')
  const [invoiceError, setInvoiceError] = useState('')
  const [formError, setFormError] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['payouts', filters],
    queryFn: () => payoutsApi.list(filters).then((r) => r.data),
    keepPreviousData: true,
  })

  const { data: invoiceSuggestions, isLoading: searchingInvoices } = useQuery({
    queryKey: ['invoice-search', invoiceSearch],
    queryFn: () =>
      invoicesApi.list({ search: invoiceSearch, limit: 8, page: 1 }).then((r) => r.data),
    enabled: invoiceSearch.length >= 2,
  })

  const recordMutation = useMutation({
    mutationFn: ({ invoiceId, data }) => payoutsApi.record(invoiceId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payouts'] })
      setShowModal(false)
      setForm(EMPTY_FORM)
      setInvoiceSearch('')
      setFormError('')
    },
    onError: (err) => {
      setFormError(err.response?.data?.error || 'Failed to record payment.')
    },
  })

  function openModal() {
    setForm(EMPTY_FORM)
    setInvoiceSearch('')
    setInvoiceError('')
    setFormError('')
    setShowModal(true)
  }

  function selectInvoice(inv) {
    setForm((f) => ({ ...f, invoice_id: inv.id, invoice_serial: inv.serialNumber }))
    setInvoiceSearch(inv.serialNumber)
    setInvoiceError('')
  }

  function submitPayment(e) {
    e.preventDefault()
    if (!form.invoice_id) { setInvoiceError('Select a valid invoice first.'); return }
    if (!form.amount_paid || parseFloat(form.amount_paid) <= 0) {
      setFormError('Enter a valid amount greater than 0.')
      return
    }
    recordMutation.mutate({
      invoiceId: form.invoice_id,
      data: {
        amount_paid: parseFloat(form.amount_paid),
        currency: form.currency,
        payment_method: form.payment_method,
        payment_reference: form.payment_reference || null,
        notes: form.notes || null,
        paid_at: form.paid_at || undefined,
      },
    })
  }

  const payments = data?.payments ?? []
  const summary = data?.summary ?? {}

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payouts</h1>
          <p className="text-gray-500 text-sm mt-1">Record and track all invoice payments.</p>
        </div>
        <button
          onClick={openModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Record Payment
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => setFilters({ ...filters, from: e.target.value, page: 1 })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => setFilters({ ...filters, to: e.target.value, page: 1 })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Method</label>
            <select
              value={filters.method}
              onChange={(e) => setFilters({ ...filters, method: e.target.value, page: 1 })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Methods</option>
              {METHODS.map((m) => (
                <option key={m} value={m}>{METHOD_LABELS[m]}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ from: monthAgo(), to: today(), method: '', page: 1 })}
              className="w-full border border-gray-300 text-gray-600 hover:bg-gray-50 rounded-lg px-3 py-2 text-sm transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-5">
          <div className="text-2xl mb-2">💸</div>
          <div className="text-2xl font-bold">
            {parseFloat(summary.grandTotal ?? 0).toLocaleString('en-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-sm font-medium opacity-80">Total Paid (EGP)</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-xl p-5">
          <div className="text-2xl mb-2">🧾</div>
          <div className="text-2xl font-bold">{data?.total ?? 0}</div>
          <div className="text-sm font-medium opacity-80">Payment Records</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 text-purple-700 rounded-xl p-5">
          <div className="text-2xl mb-2">📄</div>
          <div className="text-2xl font-bold">{data?.pages ?? 1}</div>
          <div className="text-sm font-medium opacity-80">Page{data?.pages !== 1 ? 's' : ''} of Results</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-12"><LoadingSpinner text="Loading payouts..." /></div>
        ) : payments.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">💸</div>
            <p className="font-medium">No payments found</p>
            <p className="text-sm mt-1">Try adjusting the date range or record a new payment.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Invoice</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Method</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Reference</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Approved By</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Invoice Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-mono font-medium text-blue-700">
                          {p.invoice?.serialNumber ?? '—'}
                        </div>
                        {p.invoice?.totalAmount != null && (
                          <div className="text-xs text-gray-400 mt-0.5">
                            Total: {parseFloat(p.invoice.totalAmount).toLocaleString()} {p.invoice.currency}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-gray-900">
                          {parseFloat(p.amountPaid).toLocaleString('en-EG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <span className="text-gray-500 ml-1 text-xs">{p.currency}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${METHOD_COLORS[p.paymentMethod] ?? 'bg-gray-100 text-gray-600'}`}>
                          {METHOD_LABELS[p.paymentMethod] ?? p.paymentMethod}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500 font-mono text-xs">
                        {p.paymentReference || '—'}
                      </td>
                      <td className="px-5 py-4 text-gray-600 whitespace-nowrap">
                        {p.paidAt ? new Date(p.paidAt).toLocaleDateString('en-EG', {
                          day: '2-digit', month: 'short', year: 'numeric',
                        }) : '—'}
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {p.approvedBy?.name ?? p.approvedBy?.email ?? '—'}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={p.invoice?.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data?.pages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Page {data.page} of {data.pages} — {data.total} records
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={filters.page <= 1}
                    onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
                  >
                    ← Prev
                  </button>
                  <button
                    disabled={filters.page >= data.pages}
                    onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50"
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Record Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Record Payment</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>

            <form onSubmit={submitPayment} className="p-6 space-y-4">
              {/* Invoice search */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Invoice *</label>
                <input
                  type="text"
                  value={invoiceSearch}
                  onChange={(e) => {
                    setInvoiceSearch(e.target.value)
                    setForm((f) => ({ ...f, invoice_id: '', invoice_serial: '' }))
                    setInvoiceError('')
                  }}
                  placeholder="Type serial number to search…"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${invoiceError ? 'border-red-400' : 'border-gray-300'}`}
                />
                {invoiceError && <p className="text-red-500 text-xs mt-1">{invoiceError}</p>}
                {form.invoice_id && (
                  <p className="text-green-600 text-xs mt-1">✓ Invoice {form.invoice_serial} selected</p>
                )}
                {/* Suggestions dropdown */}
                {invoiceSearch.length >= 2 && !form.invoice_id && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    {searchingInvoices ? (
                      <div className="p-3 text-sm text-gray-400 text-center">Searching…</div>
                    ) : invoiceSuggestions?.invoices?.length === 0 ? (
                      <div className="p-3 text-sm text-gray-400 text-center">No invoices found</div>
                    ) : (
                      invoiceSuggestions?.invoices?.map((inv) => (
                        <button
                          key={inv.id}
                          type="button"
                          onClick={() => selectInvoice(inv)}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 text-sm border-b border-gray-100 last:border-0"
                        >
                          <div className="font-mono font-medium text-blue-700">{inv.serialNumber}</div>
                          <div className="text-gray-500 text-xs mt-0.5">
                            {parseFloat(inv.totalAmount ?? 0).toLocaleString()} {inv.currency} — <StatusBadge status={inv.status} />
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={form.amount_paid}
                    onChange={(e) => setForm({ ...form, amount_paid: e.target.value })}
                    placeholder="0.00"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>EGP</option>
                    <option>USD</option>
                    <option>EUR</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                  <select
                    value={form.payment_method}
                    onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {METHODS.map((m) => (
                      <option key={m} value={m}>{METHOD_LABELS[m]}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                  <input
                    type="date"
                    value={form.paid_at}
                    onChange={(e) => setForm({ ...form, paid_at: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reference / Receipt No.</label>
                <input
                  type="text"
                  value={form.payment_reference}
                  onChange={(e) => setForm({ ...form, payment_reference: e.target.value })}
                  placeholder="Optional — bank ref, receipt number…"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Optional internal note…"
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                  {formError}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={recordMutation.isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg py-2.5 text-sm font-medium transition-colors"
                >
                  {recordMutation.isPending ? 'Recording…' : 'Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    draft: 'bg-gray-100 text-gray-500',
    finalized: 'bg-amber-100 text-amber-700',
    paid: 'bg-green-100 text-green-700',
  }
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${map[status] ?? 'bg-gray-100 text-gray-500'}`}>
      {status ?? '—'}
    </span>
  )
}
