import React, { useState } from 'react';
import {
  Alert, Avatar, Box, Button, Card, Chip, CircularProgress, Container, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, IconButton, MenuItem, Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Tooltip, Typography,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';
import axios from 'axios';
import { getApiError, useAuth } from '../context/AuthContext';
import { brand } from '../theme';

const emptyForm = { name: '', email: '', password: '', role: 'user' };
const fmt = (d) => (d ? format(new Date(d), 'dd MMM yyyy, HH:mm') : 'Never');

const Users = () => {
  const { user: me } = useAuth();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [toDelete, setToDelete] = useState(null);

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => (await axios.get('/api/auth/users')).data.data,
    retry: false,
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['users'] });

  const addUser = useMutation({
    mutationFn: (body) => axios.post('/api/auth/register', body),
    onSuccess: (res) => {
      enqueueSnackbar(`${res.data.data.user.name} was added`, { variant: 'success' });
      setAddOpen(false);
      refresh();
    },
    onError: (err) => setFormError(getApiError(err)),
  });

  const deleteUser = useMutation({
    mutationFn: (id) => axios.delete(`/api/auth/users/${id}`),
    onSuccess: () => {
      enqueueSnackbar('User deleted', { variant: 'success' });
      setToDelete(null);
      refresh();
    },
    onError: (err) => {
      enqueueSnackbar(getApiError(err), { variant: 'error' });
      setToDelete(null);
    },
  });

  const openAdd = () => {
    setForm(emptyForm);
    setFormError('');
    setAddOpen(true);
  };

  const submitAdd = () => {
    if (!form.name || !form.email || !form.password) {
      setFormError('Name, email and password are all required.');
      return;
    }
    setFormError('');
    addUser.mutate(form);
  };

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }} spacing={2} flexWrap="wrap" useFlexGap>
        <Box>
          <Typography variant="h4">Users</Typography>
          <Typography color="text.secondary">
            {users.length} {users.length === 1 ? 'account' : 'accounts'} stored in the database
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<PersonAddIcon />} onClick={openAdd}>Add user</Button>
      </Stack>

      <Card>
        {isLoading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress /></Box>
        ) : error ? (
          <Alert severity="error" sx={{ m: 2 }}>{getApiError(error, 'Could not load users.')}</Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell>Last login</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{ width: 36, height: 36, background: brand.gradient, fontSize: '0.85rem', fontWeight: 700 }}>
                          {u.name.slice(0, 1).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600 }}>
                            {u.name} {u.id === me?.id && <Chip size="small" label="You" sx={{ ml: 0.5, height: 20 }} />}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">{u.email}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip size="small" label={u.role} color={u.role === 'admin' ? 'primary' : 'default'} sx={{ textTransform: 'capitalize' }} />
                    </TableCell>
                    <TableCell>{fmt(u.createdAt)}</TableCell>
                    <TableCell>{fmt(u.lastLoginAt)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title={u.id === me?.id ? "You can't delete yourself" : 'Delete user'}>
                        <span>
                          <IconButton disabled={u.id === me?.id} onClick={() => setToDelete(u)} aria-label={`delete ${u.name}`}>
                            <DeleteOutlineIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      <Dialog open={addOpen} onClose={() => setAddOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 700 }}>Add user</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {formError && <Alert severity="error">{formError}</Alert>}
            <TextField label="Name" value={form.name} onChange={set('name')} fullWidth autoFocus />
            <TextField label="Email" type="email" value={form.email} onChange={set('email')} fullWidth />
            <TextField label="Password" type="password" value={form.password} onChange={set('password')} helperText="At least 8 characters" fullWidth />
            <TextField select label="Role" value={form.role} onChange={set('role')} fullWidth>
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAddOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitAdd} disabled={addUser.isLoading}>
            {addUser.isLoading ? 'Adding...' : 'Add user'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={Boolean(toDelete)} onClose={() => setToDelete(null)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete user?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {toDelete?.name} ({toDelete?.email}) will lose access immediately. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setToDelete(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => deleteUser.mutate(toDelete.id)} disabled={deleteUser.isLoading}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Users;
