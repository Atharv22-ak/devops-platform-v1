import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Alert, Box, Button, CircularProgress, IconButton, InputAdornment, Stack, Tab, Tabs, TextField, Typography,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import HubIcon from '@mui/icons-material/Hub';
import SpeedIcon from '@mui/icons-material/Speed';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import { useAuth, getApiError } from '../context/AuthContext';
import { brand } from '../theme';

const FEATURES = [
  { icon: <SpeedIcon />, title: 'Live monitoring', text: 'Prometheus and Grafana metrics in one place.' },
  { icon: <ArticleOutlinedIcon />, title: 'Centralised logs', text: 'Search ELK logs from every service.' },
  { icon: <DnsOutlinedIcon />, title: 'Service health', text: 'See what is up, down or degraded at a glance.' },
];

const emptyForm = { name: '', email: '', password: '' };

const Login = () => {
  const { user, login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState('signin');
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || '/';
  if (user) return <Navigate to={redirectTo} replace />;

  const isSignup = mode === 'signup';
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email || !form.password || (isSignup && !form.name)) {
      setError(isSignup ? 'Name, email and password are required.' : 'Enter your email and password.');
      return;
    }
    if (isSignup && form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setSubmitting(true);
    try {
      if (isSignup) await signup(form.name, form.email, form.password);
      else await login(form.email, form.password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getApiError(err));
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: 'background.default' }}>
      {/* Brand panel */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: '0 0 46%',
          p: 6,
          color: '#fff',
          background: brand.gradient,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', top: -120, right: -140, bgcolor: 'rgba(255,255,255,0.10)' }} />
        <Box sx={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', bottom: -90, left: -80, bgcolor: 'rgba(255,255,255,0.08)' }} />

        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ position: 'relative' }}>
          <Box sx={{ width: 42, height: 42, borderRadius: 2.5, bgcolor: 'rgba(255,255,255,0.2)', display: 'grid', placeItems: 'center' }}>
            <HubIcon />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>DevOps Platform</Typography>
        </Stack>

        <Box sx={{ position: 'relative' }}>
          <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.15, mb: 2 }}>
            Run, watch and debug<br />your stack in one place.
          </Typography>
          <Typography sx={{ opacity: 0.85, mb: 4, maxWidth: 420 }}>
            A practice platform for Kubernetes, monitoring and logging - sign in to open your dashboard.
          </Typography>
          <Stack spacing={2.5}>
            {FEATURES.map((f) => (
              <Stack key={f.title} direction="row" spacing={2} alignItems="center">
                <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  {f.icon}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600 }}>{f.title}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>{f.text}</Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Box>

        <Typography variant="body2" sx={{ opacity: 0.7, position: 'relative' }}>
          &copy; {new Date().getFullYear()} DevOps Practice Platform
        </Typography>
      </Box>

      {/* Form panel */}
      <Box sx={{ flex: 1, display: 'grid', placeItems: 'center', p: { xs: 2.5, sm: 4 } }}>
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          <Stack direction="row" spacing={1.5} alignItems="center" sx={{ display: { xs: 'flex', md: 'none' }, mb: 4 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 2.5, background: brand.gradient, color: '#fff', display: 'grid', placeItems: 'center' }}>
              <HubIcon fontSize="small" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>DevOps Platform</Typography>
          </Stack>

          <Typography variant="h4" sx={{ mb: 0.5 }}>{isSignup ? 'Create your account' : 'Welcome back'}</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {isSignup ? 'It takes less than a minute.' : 'Sign in to continue to your dashboard.'}
          </Typography>

          <Tabs
            value={mode}
            onChange={(_, v) => { setMode(v); setError(''); }}
            variant="fullWidth"
            sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab value="signin" label="Sign in" />
            <Tab value="signup" label="Create account" />
          </Tabs>

          <form onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.2}>
              {error && <Alert severity="error">{error}</Alert>}

              {isSignup && (
                <TextField label="Full name" value={form.name} onChange={set('name')} autoComplete="name" fullWidth autoFocus />
              )}
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={set('email')}
                autoComplete="email"
                fullWidth
                autoFocus={!isSignup}
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                helperText={isSignup ? 'At least 8 characters' : undefined}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility" edge="end" onClick={() => setShowPassword((s) => !s)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button type="submit" variant="contained" size="large" disabled={submitting} sx={{ py: 1.3 }}>
                {submitting ? <CircularProgress size={22} color="inherit" /> : isSignup ? 'Create account' : 'Sign in'}
              </Button>
            </Stack>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
