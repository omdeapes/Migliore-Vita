import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Trips from './pages/Trips/Trips';
import Invoices from './pages/Invoices/Invoices';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={(
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            )}
          />
          <Route
            path="/trips"
            element={(
              <PrivateRoute>
                <Trips />
              </PrivateRoute>
            )}
          />
          <Route
            path="/invoices"
            element={(
              <PrivateRoute>
                <Invoices />
              </PrivateRoute>
            )}
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;