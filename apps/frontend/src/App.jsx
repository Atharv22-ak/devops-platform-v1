import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, CssBaseline, Typography, Box } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Monitoring from './pages/Monitoring';
import Logs from './pages/Logs';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import axios from 'axios';

function App() {
  const { enqueueSnackbar } = useSnackbar();

  // Health check for backend API
  const { data: backendStatus, isLoading, isError } = useQuery({
    queryKey: ['backendStatus'],
    queryFn: async () => {
      const response = await axios.get('/api/health');
      return response.data;
    },
    refetchInterval: 30000, // 30 seconds
    retry: false,
  });

  // Show connection status
  React.useEffect(() => {
    if (!isLoading && !isError && backendStatus) {
      enqueueSnackbar(`Backend connected: ${backendStatus.status}`, {
        variant: 'success',
        autoHideDuration: 3000,
      });
    } else if (isError) {
      enqueueSnackbar('Backend connection failed', {
        variant: 'error',
        autoHideDuration: 5000,
      });
    }
  }, [isLoading, isError, backendStatus, enqueueSnackbar]);

  return (
    <>
      <CssBaseline />
      <Header backendStatus={backendStatus} isLoading={isLoading} isError={isError} />
      <Box sx={{ minHeight: 'calc(100vh - 64px - 64px)' }}>
        <Container maxWidth="lg">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/services" element={<Services />} />
            <Route path="/monitoring" element={<Monitoring />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

export default App;
