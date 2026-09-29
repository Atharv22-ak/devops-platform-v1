import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound = () => {
  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <Card sx={{ maxWidth: 400, textAlign: 'center', py: 4, px: 4 }}>
        <CardContent>
          <ErrorOutlineIcon fontSize="large" sx={{ mb: 3, color: 'error.main' }} />
          <Typography variant="h4" gutterBottom>
            Page Not Found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            The page you are looking for does not exist or has been moved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" component={Link} to="/">
              Return to Home
            </Button>
            <Button variant="contained" component={Link} to="/dashboard">
              Go to Dashboard
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NotFound;
