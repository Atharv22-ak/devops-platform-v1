import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Monitoring from './pages/Monitoring';
import Logs from './pages/Logs';
import Settings from './pages/Settings';
import Users from './pages/Users';
import NotFound from './pages/NotFound';
import { useAuth } from './context/AuthContext';

const Splash = () => (
  <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
    <CircularProgress />
  </Box>
);

// Everything except /login needs a signed-in user
const RequireAuth = ({ children }) => {
  const { user, initializing } = useAuth();
  const location = useLocation();
  if (initializing) return <Splash />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
};

const RequireAdmin = ({ children }) => {
  const { isAdmin } = useAuth();
  return isAdmin ? children : <Navigate to="/" replace />;
};

function App() {
  const { initializing } = useAuth();
  if (initializing) return <Splash />;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/services" element={<Services />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/users" element={<RequireAdmin><Users /></RequireAdmin>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
