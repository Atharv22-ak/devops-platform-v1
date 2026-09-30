import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  AppBar, Avatar, Box, Chip, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText,
  Menu, MenuItem, Stack, Toolbar, Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import HubIcon from '@mui/icons-material/Hub';
import { useAuth } from '../context/AuthContext';
import { brand } from '../theme';

const DRAWER_WIDTH = 256;

const NAV = [
  { label: 'Dashboard', to: '/', icon: <DashboardOutlinedIcon />, end: true },
  { label: 'Services', to: '/services', icon: <DnsOutlinedIcon /> },
  { label: 'Monitoring', to: '/monitoring', icon: <MonitorHeartOutlinedIcon /> },
  { label: 'Logs', to: '/logs', icon: <ArticleOutlinedIcon /> },
  { label: 'Settings', to: '/settings', icon: <SettingsOutlinedIcon /> },
  { label: 'Users', to: '/users', icon: <PeopleOutlineIcon />, adminOnly: true },
];

const initials = (name = '') =>
  name.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('') || '?';

const SidebarContent = ({ items, onNavigate }) => (
  <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: brand.navy, color: '#cbd5e1' }}>
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 2.5, height: 72 }}>
      <Box sx={{ width: 38, height: 38, borderRadius: 2.5, background: brand.gradient, color: '#fff', display: 'grid', placeItems: 'center' }}>
        <HubIcon fontSize="small" />
      </Box>
      <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem' }}>DevOps Platform</Typography>
    </Stack>

    <Typography variant="overline" sx={{ px: 3, mt: 1, mb: 0.5, color: '#64748b', letterSpacing: '0.1em' }}>
      Menu
    </Typography>
    <List sx={{ px: 1.5, flexGrow: 1 }}>
      {items.map((item) => (
        <ListItemButton
          key={item.to}
          component={NavLink}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          sx={{
            borderRadius: 2.5,
            mb: 0.5,
            color: '#94a3b8',
            '& .MuiListItemIcon-root': { color: 'inherit', minWidth: 40 },
            '&:hover': { bgcolor: 'rgba(255,255,255,0.06)', color: '#fff' },
            '&.active': {
              color: '#fff',
              background: 'linear-gradient(90deg, rgba(79,70,229,0.55), rgba(124,58,237,0.25))',
              boxShadow: 'inset 3px 0 0 #818cf8',
            },
          }}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600, fontSize: '0.92rem' }} />
        </ListItemButton>
      ))}
    </List>

    <Typography variant="caption" sx={{ px: 3, py: 2, color: '#475569' }}>
      &copy; {new Date().getFullYear()} DevOps Practice Platform
    </Typography>
  </Box>
);

const Layout = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const { data: backendStatus, isLoading, isError } = useQuery({
    queryKey: ['backendStatus'],
    queryFn: async () => (await axios.get('/api/health')).data,
    refetchInterval: 30000,
    retry: false,
  });

  const items = NAV.filter((i) => !i.adminOnly || isAdmin);
  const current = NAV.find((i) => (i.end ? location.pathname === i.to : location.pathname.startsWith(i.to)));

  const status = isLoading
    ? { label: 'Connecting', color: 'warning' }
    : isError
      ? { label: 'Backend offline', color: 'error' }
      : { label: 'Backend online', color: 'success' };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'rgba(245,247,251,0.85)',
          backdropFilter: 'blur(10px)',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ height: 72, gap: 1 }}>
          <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ display: { md: 'none' } }} aria-label="open menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 700 }}>
            {current?.label || 'DevOps Platform'}
          </Typography>

          <Chip
            size="small"
            variant="outlined"
            color={status.color}
            label={status.label}
            icon={<Box component="span" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: `${status.color}.main`, ml: '8px !important' }} />}
            sx={{ display: { xs: 'none', sm: 'inline-flex' }, bgcolor: '#fff' }}
          />

          <Stack
            direction="row"
            spacing={1.2}
            alignItems="center"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ cursor: 'pointer', ml: 1, pl: 1.5, py: 0.5, pr: 0.5, borderRadius: 8, '&:hover': { bgcolor: 'rgba(15,23,42,0.05)' } }}
          >
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>{user?.role}</Typography>
            </Box>
            <Avatar sx={{ width: 38, height: 38, background: brand.gradient, fontSize: '0.9rem', fontWeight: 700 }}>
              {initials(user?.name)}
            </Avatar>
          </Stack>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} PaperProps={{ sx: { mt: 1, minWidth: 220, borderRadius: 3 } }}>
            <Box sx={{ px: 2, py: 1.2 }}>
              <Typography sx={{ fontWeight: 600 }}>{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { setAnchorEl(null); logout(); }} sx={{ mt: 0.5 }}>
              <LogoutIcon fontSize="small" sx={{ mr: 1.2 }} />
              Sign out
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 0 } }}
        >
          <SidebarContent items={items} onNavigate={() => setMobileOpen(false)} />
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 0 } }}
        >
          <SidebarContent items={items} />
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, pt: '72px' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
