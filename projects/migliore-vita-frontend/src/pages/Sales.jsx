import { useState, useEffect } from 'react';

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/sales')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch sales');
        return res.json();
      })
      .then(data => {
        setSales(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Sales Dashboard</h1>
      <ul>
        {sales.map(sale => (
          <li key={sale.id}>Sale #{sale.id} - Status: {sale.status}</li>
        ))}
      </ul>
    </div>
  );
}