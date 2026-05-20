// src/pages/Trips/Trips.jsx
// Trips management page for Migliore Vita Admin

import { useEffect, useState } from 'react';
import { fetchTrips, createTrip, updateTrip } from '../../utils/api';
import '../../style.css';

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    photographerId: '',
    dateFrom: '',
    dateTo: '',
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTrip, setNewTrip] = useState({
    photographerId: '',
    location: '',
    date: '',
    status: 'scheduled',
  });
  const [editingTrip, setEditingTrip] = useState(null);

  useEffect(() => {
    const loadTrips = async () => {
      try {
        const data = await fetchTrips(filters);
        setTrips(data);
      } catch (err) {
        setError('Failed to load trips');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTrips();
  }, [filters]);

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    try {
      await createTrip(newTrip);
      setShowCreateForm(false);
      setNewTrip({
        photographerId: '',
        location: '',
        date: '',
        status: 'scheduled',
      });
      const data = await fetchTrips(filters);
      setTrips(data);
    } catch (err) {
      setError('Failed to create trip');
      console.error(err);
    }
  };

  const handleUpdateTrip = async (e) => {
    e.preventDefault();
    try {
      await updateTrip(editingTrip.id, editingTrip);
      setEditingTrip(null);
      const data = await fetchTrips(filters);
      setTrips(data);
    } catch (err) {
      setError('Failed to update trip');
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="trips-container">
      <h1>Trips</h1>

      {/* Filters */}
      <div className="filters">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
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
        <button onClick={() => setShowCreateForm(true)}>Create Trip</button>
      </div>

      {/* Trips Table */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Photographer</th>
            <th>Location</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((trip) => (
            <tr key={trip.id}>
              <td>{trip.id}</td>
              <td>{trip.photographer?.name}</td>
              <td>{trip.location}</td>
              <td>{new Date(trip.date).toLocaleDateString()}</td>
              <td>{trip.status}</td>
              <td>
                <button onClick={() => setEditingTrip(trip)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Create Trip Form */}
      {showCreateForm && (
        <div className="modal">
          <div className="modal-content">
            <h2>Create Trip</h2>
            <form onSubmit={handleCreateTrip}>
              <div>
                <label>Photographer ID:</label>
                <input
                  type="text"
                  value={newTrip.photographerId}
                  onChange={(e) => setNewTrip({ ...newTrip, photographerId: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Location:</label>
                <input
                  type="text"
                  value={newTrip.location}
                  onChange={(e) => setNewTrip({ ...newTrip, location: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Date:</label>
                <input
                  type="date"
                  value={newTrip.date}
                  onChange={(e) => setNewTrip({ ...newTrip, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Status:</label>
                <select
                  value={newTrip.status}
                  onChange={(e) => setNewTrip({ ...newTrip, status: e.target.value })}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <button type="submit">Create</button>
              <button type="button" onClick={() => setShowCreateForm(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Trip Form */}
      {editingTrip && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Trip</h2>
            <form onSubmit={handleUpdateTrip}>
              <div>
                <label>Location:</label>
                <input
                  type="text"
                  value={editingTrip.location}
                  onChange={(e) => setEditingTrip({ ...editingTrip, location: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Date:</label>
                <input
                  type="date"
                  value={editingTrip.date.split('T')[0]}
                  onChange={(e) => setEditingTrip({ ...editingTrip, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label>Status:</label>
                <select
                  value={editingTrip.status}
                  onChange={(e) => setEditingTrip({ ...editingTrip, status: e.target.value })}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <button type="submit">Update</button>
              <button type="button" onClick={() => setEditingTrip(null)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}