import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Stack,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  TextField,
  Button,
} from '@mui/material';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  Bar,
  Line,
  Pie,
  Doughnut,
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DateRangeIcon from '@mui/icons-material/DateRange';
import RefreshIcon from '@mui/icons-material/Refresh';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Monitoring = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  const { data: prometheusData, isLoading: promLoading, error: promError } = useQuery({
    queryKey: ['prometheusData'],
    queryFn: async () => {
      const response = await axios.get('/api/monitoring/prometheus');
      return response.data;
    },
    refetchInterval: 15000, // 15 seconds
    retry: false,
  });

  const { data: elkData, isLoading: elkLoading, error: elkError } = useQuery({
    queryKey: ['elkData'],
    queryFn: async () => {
      const response = await axios.get('/api/monitoring/elk');
      return response.data;
    },
    refetchInterval: 10000, // 10 seconds
    retry: false,
  });

  const { data: grafanaData, isLoading: grafanaLoading, error: grafanaError } = useQuery({
    queryKey: ['grafanaData'],
    queryFn: async () => {
      const response = await axios.get('/api/monitoring/grafana');
      return response.data;
    },
    refetchInterval: 20000, // 20 seconds
    retry: false,
  });

  // Chart data placeholders
  const cpuChartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [{
      label: 'CPU Usage (%)',
      data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 80)),
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1,
      fill: true,
    }]
  };

  const memoryChartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [{
      label: 'Memory Usage (%)',
      data: Array.from({ length: 24 }, () => Math.floor(Math.random() * 90)),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      tension: 0.1,
      fill: true,
    }]
  };

  const networkChartData = {
    labels: ['Incoming', 'Outgoing'],
    datasets: [{
      label: 'Network Traffic (MB)',
      data: [Math.floor(Math.random() * 1000), Math.floor(Math.random() * 800)],
      backgroundColor: [
        'rgb(54, 162, 235)',
        'rgb(255, 99, 132)'
      ],
      hoverOffset: 4
    }]
  };

  const logLevelChartData = {
    labels: ['INFO', 'WARN', 'ERROR', 'DEBUG'],
    datasets: [{
      label: 'Log Distribution',
      data: [Math.floor(Math.random() * 1000), Math.floor(Math.random() * 200), Math.floor(Math.random() * 50), Math.floor(Math.random() * 300)],
      backgroundColor: [
        'rgb(75, 192, 192)',
        'rgb(255, 206, 86)',
        'rgb(255, 99, 132)',
        'rgb(153, 102, 255)'
      ],
      hoverOffset: 4
    }]
  };

  const isLoading = promLoading || elkLoading || grafanaLoading;
  const hasError = promError || elkError || grafanaError;

  if (isLoading) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Monitoring & Observability
        </Typography>
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <CircularProgress size={48} />
          <Typography variant="body2" mt={2}>Loading monitoring data...</Typography>
        </Box>
      </Box>
    );
  }

  if (hasError) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Monitoring & Observability
        </Typography>
        <Alert severity="error">
          Error loading monitoring data. Please check your connection and try again.
        </Alert>
      </Box>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Monitoring & Observability
      </Typography>
      
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="System Metrics" />
        <Tab label="Logs & Tracing" />
        <Tab label="Dashboards" />
      </Tabs>
      
      <Divider sx={{ mb: 3 }} />
      
      {activeTab === 0 && (
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Resource Utilization Trends
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: 300 }}>
                  <CardHeader title="CPU Usage (Last 24 Hours)" />
                  <CardContent>
                    <Line
                      data={cpuChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          title: { display: false }
                        },
                        scales: {
                          y: { beginAtZero: true, max: 100 }
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: 300 }}>
                  <CardHeader title="Memory Usage (Last 24 Hours)" />
                  <CardContent>
                    <Line
                      data={memoryChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          title: { display: false }
                        },
                        scales: {
                          y: { beginAtZero: true, max: 100 }
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: 300 }}>
                  <CardHeader title="Network I/O" />
                  <CardContent>
                    <Doughnut
                      data={networkChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { position: 'bottom' },
                          title: { display: false }
                        }
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card sx={{ height: 300 }}>
                  <CardHeader title="Disk Utilization" />
                  <CardContent>
                    <Typography variant="body2" sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="h2" sx={{ fontWeight: 600 }}>
                        68%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Used / Total
                      </Typography>
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Available: 32.4 GB
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Total: 100.0 GB
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Service Dependencies & Health
            </Typography>
            <Card sx={{ height: 350 }}>
              <CardContent>
                <Typography variant="body2">
                  Service dependency mapping and health checks would be implemented here.
                  In a real deployment, this would show a service mesh visualization
                  or dependency graph from tools like Istio, Linkerd, or AWS App Mesh.
                </Typography>
                <Box sx={{ mt: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Healthy Services:</strong> 8/10
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Avg Response Time:</strong> 142ms
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Error Rate:</strong> 0.02%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </>
      )}
      
      {activeTab === 1 && (
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Log Analytics & Search
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Search logs"
                placeholder="Enter search term (e.g., error, timeout, connection)..."
                sx={{ width: '100%', maxWidth: 500 }}
                InputProps={{
                  endAdornment: (
                    <Button variant="outlined" size="small">
                      <SearchIcon fontSize="small" />
                    </Button>
                  ),
                }}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" size="small">
                  <FilterListIcon fontSize="small" /> Filter by Level
                </Button>
                <Button variant="outlined" size="small">
                  <DateRangeIcon fontSize="small" /> Time Range
                </Button>
                <Button variant="contained" size="small">
                  <RefreshIcon fontSize="small" /> Refresh
                </Button>
              </Box>
            </Stack>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Log Distribution
            </Typography>
            <Card sx={{ height: 300 }}>
              <CardContent>
                <Pie
                  data={logLevelChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'right' },
                      title: { display: false }
                    }
                  }}
                />
              </CardContent>
            </Card>
          </Box>
          
          <Box>
            <Typography variant="h5" gutterBottom>
              Recent Log Entries
            </Typography>
            <Card sx={{ height: 400 }}>
              <CardContent>
                <Box sx={{ height: '100%', overflowY: 'auto' }}>
                  {/* Sample log entries */}
                  <Box sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="error.main" sx={{ fontWeight: 600 }}>
                        ERROR
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        14:23:15
                      </Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Connection timeout to database service: retrying...
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="warning.main" sx={{ fontWeight: 600 }}>
                        WARN
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        14:22:08
                      </Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      High memory usage detected on backend service (85%)
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                        INFO
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        14:21:02
                      </Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Frontend service scaled up to 3 replicas due to increased load
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2, p: 2, borderRadius: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" color="info.main" sx={{ fontWeight: 600 }}>
                        DEBUG
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        14:20:55
                      </Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cache hit ratio improved to 92% after Redis optimization
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </>
      )}
      
      {activeTab === 2 && (
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Grafana Dashboards
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              <Card sx={{ width: 200, height: 260 }}>
                <CardHeader title="System Overview" />
                <CardContent>
                  <Typography variant="body2" sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h3" sx={{ fontWeight: 600 }}>
                      8 Services
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Running
                    </Typography>
                  </Typography>
                </CardContent>
                <Box sx={{ mt: 2 }}>
                  <Button variant="outlined" size="small" sx={{ width: '100%' }}>
                    View in Grafana
                  </Button>
                </Box>
              </Card>
              
              <Card sx={{ width: 200, height: 260 }}>
                <CardHeader title="Application Metrics" />
                <CardContent>
                  <Typography variant="body2" sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h3" sx={{ fontWeight: 600 }}>
                      99.2%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Uptime
                    </Typography>
                  </Typography>
                </CardContent>
                <Box sx={{ mt: 2 }}>
                  <Button variant="outlined" size="small" sx={{ width: '100%' }}>
                    View in Grafana
                  </Button>
                </Box>
              </Card>
              
              <Card sx={{ width: 200, height: 260 }}>
                <CardHeader title="Database Performance" />
                <CardContent>
                  <Typography variant="body2" sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h3" sx={{ fontWeight: 600 }}>
                      45ms
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Avg Query Time
                    </Typography>
                  </Typography>
                </CardContent>
                <Box sx={{ mt: 2 }}>
                  <Button variant="outlined" size="small" sx={{ width: '100%' }}>
                    View in Grafana
                  </Button>
                </Box>
              </Card>
              
              <Card sx={{ width: 200, height: 260 }}>
                <CardHeader title="Error Rates" />
                <CardContent>
                  <Typography variant="body2" sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="h3" sx={{ fontWeight: 600 }}>
                      0.01%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Error Rate
                    </Typography>
                  </Typography>
                </CardContent>
                <Box sx={{ mt: 2 }}>
                  <Button variant="outlined" size="small" sx={{ width: '100%' }}>
                    View in Grafana
                  </Button>
                </Box>
              </Card>
            </Box>
          </Box>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Custom Dashboard Builder
            </Typography>
            <Card sx={{ height: 200 }}>
              <CardContent>
                <Typography variant="body2">
                  In a production environment, users could create custom dashboards
                  by selecting metrics from Prometheus, configuring visualization types,
                  and setting alert thresholds.
                </Typography>
                <Box sx={{ mt: 3, textAlign: 'right' }}>
                  <Button variant="contained" size="small">
                    Create New Dashboard
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Monitoring;
