import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Stack,
  Divider,
  Chip,
  ButtonGroup,
  Grid,
  CircularProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RefreshIcon from '@mui/icons-material/Refresh';
import EyeIcon from '@mui/icons-material/RemoveRedEye';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  
  const { data: services, isLoading, error } = useQuery({
    queryKey: ['services', searchTerm],
    queryFn: async () => {
      const response = await axios.get(`/api/services?search=${searchTerm}`);
      return response.data;
    },
    staleTime: 30000, // 30 seconds
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleRefresh = () => {
    // Invalidate query to refetch
    // This would typically be done with queryClient.invalidateQueries
    // For simplicity, we'll just trigger a refetch by changing a dummy state
  };

  if (isLoading) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Services Management
        </Typography>
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <CircularProgress size={48} />
          <Typography variant="body2" mt={2}>Loading services...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Services Management
        </Typography>
        <Box sx={{ color: 'error.main', textAlign: 'center', my: 4 }}>
          Error loading services: {error.message}
        </Box>
      </Box>
    );
  }

  const filteredServices = services?.data?.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Services Management
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <TextField
          label="Search services"
          placeholder="Enter service name or type..."
          value={searchTerm}
          onChange={handleSearch}
          sx={{ width: '100%', maxWidth: 400 }}
          InputProps={{
            endAdornment: (
              <Button variant="outlined" size="small" onClick={handleRefresh}>
                <RefreshIcon fontSize="small" />
              </Button>
            ),
          }}
        />
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      {selectedService && (
        <Box sx={{ mb: 4 }}>
          <Card>
            <CardHeader title={`Service Details: ${selectedService.name}`} />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Service ID:</strong> {selectedService.id}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Name:</strong> {selectedService.name}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Type:</strong> {selectedService.type}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Version:</strong> {selectedService.version}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Status:</strong> 
                    <Chip
                      label={selectedService.status.toUpperCase()}
                      size="small"
                      color={selectedService.status === 'healthy' ? 'success' : 'error'}
                    />
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Uptime:</strong> {selectedService.uptime?.toFixed(2) || '0'}%
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>CPU Usage:</strong> {selectedService.resources?.cpuUsage?.toFixed(2) || '0'}%
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Memory Usage:</strong> {selectedService.resources?.memoryUsage?.toFixed(2) || '0'} MB
                  </Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3, textAlign: 'right' }}>
                <Button variant="outlined" size="small" onClick={() => setSelectedService(null)}>
                  Close Details
                </Button>
                <Button variant="contained" size="small" sx={{ ml: 2 }} onClick={() => alert('Edit service functionality would go here')}>
                  <EditIcon fontSize="small" /> Edit
                </Button>
                <Button variant="outlined" size="small" sx={{ ml: 2 }} color="error" onClick={() => {
                  if (window.confirm(`Are you sure you want to delete service ${selectedService.name}?`)) {
                    // Delete service logic would go here
                    alert('Service deletion functionality would go here');
                    setSelectedService(null);
                  }
                }}>
                  <DeleteIcon fontSize="small" /> Delete
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Active Services ({filteredServices?.length || 0})
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Service Name</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">CPU %</TableCell>
              <TableCell align="center">Memory (MB)</TableCell>
              <TableCell align="center">Uptime</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServices?.length > 0 ? (
              filteredServices.map((service) => (
                <TableRow key={service.id} hover onClick={() => handleServiceSelect(service)}>
                  <TableCell sx={{ textDecoration: 'none', color: 'inherit' }}>
                    {service.name}
                  </TableCell>
                  <TableCell align="center">{service.type}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={service.status.toUpperCase()}
                      size="small"
                      color={service.status === 'healthy' ? 'success' : 'error'}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {service.resources?.cpuUsage?.toFixed(1) || '0'}%
                  </TableCell>
                  <TableCell align="center">
                    {service.resources?.memoryUsage?.toFixed(0) || '0'} MB
                  </TableCell>
                  <TableCell align="center">
                    {service.uptime?.toFixed(1) || '0'}%
                  </TableCell>
                  <TableCell align="center">
                    <ButtonGroup size="small">
                      <Button variant="outlined" size="small" onClick={(e) => {
                        e.stopPropagation();
                        handleServiceSelect(service);
                      }}>
                        <EyeIcon fontSize="small" /> View
                      </Button>
                      <Button variant="outlined" size="small" sx={{ ml: 1 }} onClick={(e) => {
                        e.stopPropagation();
                        // Restart service logic
                      }}>
                        <RefreshIcon fontSize="small" /> Restart
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="7" align="center">
                  No services found matching your search
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
};

export default Services;
