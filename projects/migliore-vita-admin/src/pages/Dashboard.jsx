// src/pages/Dashboard.jsx
// Dashboard page for Migliore Vita Admin

import { useEffect, useState } from 'react';
import { fetchDashboardStats } from '../utils/api';
import '../style.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchDashboardStats();
        setStats(data);
      } catch (err) {
        setError('Failed to load dashboard stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Trips Today</h3>
          <p>{stats.tripsToday}</p>
        </div>
        <div className="stat-card">
          <h3>Invoices Today</h3>
          <p>{stats.invoicesToday}</p>
        </div>
        <div className="stat-card">
          <h3>Media Today</h3>
          <p>{stats.mediaToday}</p>
        </div>
        <div className="stat-card">
          <h3>Revenue Today</h3>
          <p>€{stats.revenueToday?.toFixed(2)}</p>
        </div>
      </div>
      <div className="recent-invoices">
        <h2>Recent Invoices</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Photographer</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentInvoices?.map((invoice) => (
              <tr key={invoice.id}>
                <td>{invoice.id}</td>
                <td>{invoice.photographer?.name}</td>
                <td>€{invoice.amount?.toFixed(2)}</td>
                <td>{invoice.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}