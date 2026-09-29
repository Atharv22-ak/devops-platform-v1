import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Alert,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import ListIcon from '@mui/icons-material/List';
import ArticleIcon from '@mui/icons-material/Article';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';

const Header = ({ backendStatus, isLoading, isError }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'menu-appbar' : undefined;

  const [addUserOpen, setAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
  const [addUserError, setAddUserError] = useState('');
  const [addUserSuccess, setAddUserSuccess] = useState('');
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    handleClose();
    try {
      await axios.post('/api/auth/logout');
    } catch (err) {
      // Ignore network errors on logout, still clear local session
    }
    localStorage.removeItem('token');
    navigate('/');
    window.location.reload();
  };

  const handleOpenAddUser = () => {
    handleClose();
    setAddUserError('');
    setAddUserSuccess('');
    setNewUser({ name: '', email: '', password: '' });
    setAddUserOpen(true);
  };

  const handleCloseAddUser = () => {
    setAddUserOpen(false);
  };

  const handleAddUserSubmit = async () => {
    setAddUserError('');
    setAddUserSuccess('');

    if (!newUser.name || !newUser.email || !newUser.password) {
      setAddUserError('Name, email and password are all required.');
      return;
    }

    setIsSubmittingUser(true);
    try {
      const response = await axios.post('/api/auth/register', newUser);
      setAddUserSuccess(`User "${response.data?.data?.user?.name || newUser.name}" created successfully.`);
      setNewUser({ name: '', email: '', password: '' });
    } catch (err) {
      setAddUserError(
        err.response?.data?.message || 'Failed to create user. Please try again.'
      );
    } finally {
      setIsSubmittingUser(false);
    }
  };

  const getBackendStatus = () => {
    if (isLoading) return 'Connecting...';
    if (isError) return 'Disconnected';
    return backendStatus?.status || 'Unknown';
  };

  const getBackendStatusColor = () => {
    if (isLoading) return 'warning';
    if (isError) return 'error';
    return backendStatus?.status === 'OK' ? 'success' : 'error';
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          DevOps Platform
        </Typography>
        <Button
          color="inherit"
          component={Link}
          to="/"
          startIcon={<DashboardIcon />}
        >
          Dashboard
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/services"
          startIcon={<BarChartIcon />}
        >
          Services
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/monitoring"
          startIcon={<ArticleIcon />}
        >
          Monitoring
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/logs"
          startIcon={<ListIcon />}
        >
          Logs
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/settings"
          startIcon={<SettingsIcon />}
        >
          Settings
        </Button>
        <Tooltip title="Notifications">
          <IconButton
            edge="end"
            aria-label="notifications"
            sx={{ position: 'relative' }}
          >
            <NotificationsIcon />
            <Badge badgeContent={4} color="error">
              <span />
            </Badge>
          </IconButton>
        </Tooltip>
        <Tooltip title="Profile">
          <IconButton
            edge="end"
            aria-label="account of current user"
            aria-controls={open ? 'menu-appbar' : undefined}
            aria-haspopup="true"
            onClick={handleMenu}
            sx={{ position: 'relative' }}
          >
            <PersonIcon />
          </IconButton>
        </Tooltip>
        <Menu
          id={id}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My Account</MenuItem>
          <MenuItem onClick={handleOpenAddUser}>
            <PersonAddIcon fontSize="small" sx={{ mr: 1 }} />
            Add User
          </MenuItem>
          <MenuItem onClick={handleSignOut}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
            Sign out
          </MenuItem>
        </Menu>

        <Dialog open={addUserOpen} onClose={handleCloseAddUser} fullWidth maxWidth="xs">
          <DialogTitle>Add User</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              {addUserError && <Alert severity="error">{addUserError}</Alert>}
              {addUserSuccess && <Alert severity="success">{addUserSuccess}</Alert>}
              <TextField
                label="Name"
                value={newUser.name}
                onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddUser}>Close</Button>
            <Button variant="contained" onClick={handleAddUserSubmit} disabled={isSubmittingUser}>
              {isSubmittingUser ? 'Adding...' : 'Add User'}
            </Button>
          </DialogActions>
        </Dialog>
        <Box sx={{ ml: 2 }}>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Backend:{" "}
            <Badge
              badgeContent={getBackendStatus()}
              color={getBackendStatusColor()}
              sx={{ fontSize: '0.875rem' }}
            >
              <span />
            </Badge>
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;