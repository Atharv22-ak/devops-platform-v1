import React, { useState } from 'react';
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
  TextField,
  Button,
  Stack,
  Divider,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
  IconButton,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const Logs = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [logLevelFilter, setLogLevelFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('24h');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'menu-appbar' : undefined;
  
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { data: logsData, isLoading, error } = useQuery({
    queryKey: ['logs', searchTerm, logLevelFilter, timeRange],
    queryFn: async () => {
      const response = await axios.get(`/api/logs?search=${searchTerm}&level=${logLevelFilter !== 'all' ? logLevelFilter : ''}&timeRange=${timeRange}`);
      return response.data;
    },
    staleTime: 30000, // 30 seconds
  });

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogLevelChange = (event) => {
    setLogLevelFilter(event.target.value);
  };

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handleDownloadLogs = () => {
    // In a real app, this would trigger a download
    alert('Log download functionality would be implemented here');
  };

  if (isLoading) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Log Management
        </Typography>
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <CircularProgress size={48} />
          <Typography variant="body2" mt={2}>Loading logs...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Log Management
        </Typography>
        <Box sx={{ color: 'error.main', textAlign: 'center', my: 4 }}>
          Error loading logs: {error.message}
        </Box>
      </Box>
    );
  }

  const filteredLogs = logsData?.data?.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.host.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = logLevelFilter === 'all' || log.level.toLowerCase() === logLevelFilter;
    
    // Time filtering would be more complex in reality
    return matchesSearch && matchesLevel;
  }) || [];

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Log Management
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flexWrap: 'wrap' }}>
          <TextField
            label="Search logs"
            placeholder="Enter search term..."
            value={searchTerm}
            onChange={handleSearch}
            sx={{ width: 200, maxWidth: 300 }}
            InputProps={{
              endAdornment: (
                <Tooltip title="Search">
                  <IconButton size="small">
                    <SearchIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              ),
            }}
          />
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Level:
            </Typography>
            <select
              value={logLevelFilter}
              onChange={handleLogLevelChange}
              sx={{ minWidth: 100 }}
            >
              <option value="all">All Levels</option>
              <option value="error">ERROR</option>
              <option value="warn">WARN</option>
              <option value="info">INFO</option>
              <option value="debug">DEBUG</option>
            </select>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ mr: 1 }}>
              Time:
            </Typography>
            <select
              value={timeRange}
              onChange={handleTimeRangeChange}
              sx={{ minWidth: 100 }}
            >
              <option value="1h">Last Hour</option>
              <option value="6h">Last 6 Hours</option>
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </Box>
          
          <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
            <Tooltip title="Download Logs">
              <Button variant="outlined" size="small" onClick={handleDownloadLogs}>
                <DownloadIcon fontSize="small" />
              </Button>
            </Tooltip>
            
            <Tooltip title="More Actions">
              <IconButton
                aria-label="more actions"
                aria-controls={open ? 'menu-appbar' : undefined}
                aria-haspopup="true"
                onClick={handleMenu}
              >
                <MoreVertIcon />
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
              <MenuItem onClick={handleClose}>Export as CSV</MenuItem>
              <MenuItem onClick={handleClose}>Export as JSON</MenuItem>
              <MenuItem onClick={handleClose}>Create Alert from Search</MenuItem>
              <MenuItem onClick={handleClose}>Save Search</MenuItem>
              <MenuItem onClick={handleClose}>Share Link</MenuItem>
            </Menu>
          </Box>
        </Stack>
      </Box>
      
      <Divider sx={{ mb: 3 }} />
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Log Statistics ({filteredLogs.length} entries)
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: 120 }}>
              <CardContent>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Total Entries:
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 600 }}>
                  {filteredLogs.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: 120 }}>
              <CardContent>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  ERROR Count:
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 600, color: 'error.main' }}>
                  {filteredLogs.filter(log => log.level === 'ERROR').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: 120 }}>
              <CardContent>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  WARN Count:
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 600, color: 'warning.main' }}>
                  {filteredLogs.filter(log => log.level === 'WARN').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: 120 }}>
              <CardContent>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  INFO Count:
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 600, color: 'success.main' }}>
                  {filteredLogs.filter(log => log.level === 'INFO').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Log Entries
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Timestamp</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Host</TableCell>
              <TableCell align="center">Level</TableCell>
              <TableCell>Message</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <TableRow key={log.id} hover sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {new Date(log.timestamp).toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" textTransform="capitalize">
                      {log.service}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {log.host}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={log.level.toUpperCase()}
                      size="small"
                      color={
                        log.level === 'ERROR' ? 'error' :
                        log.level === 'WARN' ? 'warning' :
                        log.level === 'INFO' ? 'success' : 'info'
                      }
                    />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                      {log.message}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                      <Tooltip title="View Details">
                        <IconButton size="small" aria-label="view details">
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Copy to Clipboard">
                        <IconButton size="small" aria-label="copy to clipboard">
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan="6" align="center">
                  No logs found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
};

export default Logs;
