import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { data: systemMetrics, isLoading: metricsLoading, error: metricsError } = useQuery({
    queryKey: ['systemMetrics'],
    queryFn: async () => {
      const response = await axios.get('/api/monitoring/system');
      return response.data;
    },
    refetchInterval: 10000, // 10 seconds
    retry: false,
  });

  const { data: serviceStatus, isLoading: servicesLoading, error: servicesError } = useQuery({
    queryKey: ['serviceStatus'],
    queryFn: async () => {
      const response = await axios.get('/api/services');
      return response.data;
    },
    refetchInterval: 15000, // 15 seconds
    retry: false,
  });

  const { data: recentLogs, isLoading: logsLoading, error: logsError } = useQuery({
    queryKey: ['recentLogs'],
    queryFn: async () => {
      const response = await axios.get('/api/logs?limit=10');
      return response.data;
    },
    refetchInterval: 5000, // 5 seconds
    retry: false,
  });

  // Mock data for charts if API is not available
  const chartData = {
    labels: Array.from({ length: 20 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'CPU Usage (%)',
        data: Array.from({ length: 20 }, () => Math.floor(Math.random() * 80)),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
        fill: true,
      },
      {
        label: 'Memory Usage (%)',
        data: Array.from({ length: 20 }, () => Math.floor(Math.random() * 90)),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
        fill: true,
      }
    ]
  };

  if (metricsLoading || servicesLoading || logsLoading) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          DevOps Practice Platform Dashboard
        </Typography>
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <CircularProgress size={48} />
          <Typography variant="body2" mt={2}>Loading dashboard data...</Typography>
        </Box>
      </Box>
    );
  }

  if (metricsError || servicesError || logsError) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          DevOps Practice Platform Dashboard
        </Typography>
        <Alert severity="error">
          Error loading dashboard data. Please check your connection and try again.
        </Alert>
      </Box>
    );
  }

  return (
    <>
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          DevOps Practice Platform Dashboard
        </Typography>
        
        {/* System Metrics */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            System Overview
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title="CPU Utilization" />
                <CardContent>
                  <Typography variant="h3" sx={{ fontWeight: 600 }}>
                    {systemMetrics?.data?.cpuUsage?.toFixed(1) || '--'}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current usage
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title="Memory Usage" />
                <CardContent>
                  <Typography variant="h3" sx={{ fontWeight: 600 }}>
                    {systemMetrics?.data?.memoryUsage?.toFixed(1) || '--'}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Used / Total
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title="Disk Usage" />
                <CardContent>
                  <Typography variant="h3" sx={{ fontWeight: 600 }}>
                    {systemMetrics?.data?.diskUsage?.toFixed(1) || '--'}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Utilization
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ height: '100%' }}>
                <CardHeader title="Network" />
                <CardContent>
                  <Typography variant="h3" sx={{ fontWeight: 600 }}>
                    {systemMetrics?.data?.networkIn?.toFixed(2) || '--'} KB/s
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In / Out
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Service Status */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Service Health Status
          </Typography>
          <Grid container spacing={2}>
            {serviceStatus?.data?.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.id}>
                <Card sx={{ height: '100%' }}>
                  <CardHeader
                    title={service.name}
                    avatar={
                      <Box
                        sx={{
                          bgcolor: service.status === 'healthy' ? 'success.main' : 'error.main',
                          color: 'white',
                          width: 36,
                          height: 36,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 2,
                        }}
                      >
                        {service.status === 'healthy' ? '✓' : '✗'}
                      </Box>
                    }
                  />
                  <CardContent>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Status: <strong>{service.status.toUpperCase()}</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Uptime: <strong>{service.uptime?.toFixed(1) || '0'}%</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                      Last checked: {new Date(service.updatedAt).toLocaleTimeString()}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Performance Charts */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Performance Trends (Last 20 Minutes)
          </Typography>
          <Card sx={{ height: 400 }}>
            <CardContent>
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Resource Usage Over Time'
                    }
                  },
                  interaction: {
                    intersect: false,
                    mode: 'index',
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        callback: (value) => value + '%'
                      }
                    }
                  }
                }}
              />
            </CardContent>
          </Card>
        </Box>

        {/* Recent Activity */}
        <Box>
          <Typography variant="h5" gutterBottom>
            Recent System Activity
          </Typography>
          <Card sx={{ height: 300 }}>
            <CardContent>
              {recentLogs?.data?.length > 0 ? (
                <Box sx={{ height: '100%', overflowY: 'auto' }}>
                  {recentLogs.data.map((log, index) => (
                    <Box key={index} sx={{ pb: 2, borderBottom: 1, borderColor: 'divider' }}>
                      <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {log.level}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </Typography>
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {log.message}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" align="center">
                  No recent logs available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;
