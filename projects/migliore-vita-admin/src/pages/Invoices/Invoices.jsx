// src/pages/Invoices/Invoices.jsx
// Invoices management page for Migliore Vita Admin

import { useEffect, useState } from 'react';
import { fetchInvoices, deliverInvoice } from '../../utils/api';
import '../../style.css';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    photographerId: '',
    dateFrom: '',
    dateTo: '',
    search: '',
  });

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const data = await fetchInvoices(filters);
        setInvoices(data);
      } catch (err) {
        setError('Failed to load invoices');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadInvoices();
  }, [filters]);

  const handleDeliverInvoice = async (invoiceId) => {
    try {
      await deliverInvoice(invoiceId);
      const data = await fetchInvoices(filters);
      setInvoices(data);
      alert('Invoice delivery triggered successfully!');
    } catch (err) {
      setError('Failed to deliver invoice');
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="invoices-container">
      <h1>Invoices</h1>

      {/* Filters */}
      <div className="filters">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <input
          type="text"
          value={filters.photographerId}
          onChange={(e) => setFilters({ ...filters, photographerId: e.target.value })}
          placeholder="Photographer ID"
        />
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
          placeholder="From Date"
        />
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
          placeholder="To Date"
        />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="Search"
        />
      </div>

      {/* Invoices Table */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Photographer</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>{invoice.photographer?.name}</td>
              <td>€{invoice.amount?.toFixed(2)}</td>
              <td>{new Date(invoice.date).toLocaleDateString()}</td>
              <td>{invoice.status}</td>
              <td>
                <button onClick={() => handleDeliverInvoice(invoice.id)}>
                  Deliver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}