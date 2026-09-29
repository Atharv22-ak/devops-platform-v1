import React, { useState } from 'react';
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
  TextField,
  Button,
  Switch,
  FormControlLabel,
  FormControl,
  Select,
  MenuItem,
  Slider,
  CircularProgress,
  Alert,
  Checkbox,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [settingsData, setSettingsData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const { data: currentSettings, isLoading, error } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await axios.get('/api/settings');
      return response.data;
    },
    staleTime: 300000, // 5 minutes
  });
  
  // Initialize form values from settings data
  React.useEffect(() => {
    if (currentSettings) {
      setSettingsData(currentSettings);
    }
  }, [currentSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await axios.put('/api/settings', settingsData);
      // Show success message
      alert('Settings saved successfully!');
      setIsSaving(false);
    } catch (err) {
      alert('Failed to save settings');
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      setSettingsData({
        // Default values would come from API in real app
        general: {
          siteName: 'DevOps Practice Platform',
          siteUrl: 'http://localhost:3000',
          timezone: 'UTC',
          language: 'en',
          dateFormat: 'YYYY-MM-DD',
          timeFormat: 'HH:mm:ss'
        },
        notifications: {
          emailEnabled: true,
          slackEnabled: false,
          webhookEnabled: false,
          alertThreshold: 80
        },
        security: {
          sessionTimeout: 30,
          maxLoginAttempts: 5,
          passwordPolicy: 'strong',
          twoFactorEnabled: false
        },
        performance: {
          cacheEnabled: true,
          cacheTTL: 300,
          compressionEnabled: true,
          maxWorkers: 4
        },
        integrations: {
          prometheusEnabled: true,
          grafanaEnabled: true,
          elkEnabled: true,
          webhookUrl: ''
        }
      });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Settings Management
        </Typography>
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <CircularProgress size={48} />
          <Typography variant="body2" mt={2}>Loading settings...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Settings Management
        </Typography>
        <Box sx={{ color: 'error.main', textAlign: 'center', my: 4 }}>
          Error loading settings: {error.message}
        </Box>
      </Box>
    );
  }

  // Use settingsData or fallback to empty object
  const settings = settingsData || {
    general: {
      siteName: 'DevOps Practice Platform',
      siteUrl: 'http://localhost:3000',
      timezone: 'UTC',
      language: 'en',
      dateFormat: 'YYYY-MM-DD',
      timeFormat: 'HH:mm:ss'
    },
    notifications: {
      emailEnabled: true,
      slackEnabled: false,
      webhookEnabled: false,
      alertThreshold: 80
    },
    security: {
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordPolicy: 'strong',
      twoFactorEnabled: false
    },
    performance: {
      cacheEnabled: true,
      cacheTTL: 300,
      compressionEnabled: true,
      maxWorkers: 4
    },
    integrations: {
      prometheusEnabled: true,
      grafanaEnabled: true,
      elkEnabled: true,
      webhookUrl: ''
    }
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Settings Management
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Configure platform settings to customize behavior, integrations, and performance.
        </Typography>
      </Box>
      
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="General" />
        <Tab label="Notifications" />
        <Tab label="Security" />
        <Tab label="Performance" />
        <Tab label="Integrations" />
      </Tabs>
      
      <Divider sx={{ mb: 3 }} />
      
      {activeTab === 0 && (
        <Card sx={{ height: '100%' }}>
          <CardHeader title="General Settings" />
          <CardContent>
            <Stack spacing={3}>
              <TextField
                label="Site Name"
                value={settings.general?.siteName || ''}
                onChange={(e) => {
                  setSettingsData(prev => ({
                    ...prev,
                    general: {
                      ...prev.general,
                      siteName: e.target.value
                    }
                  }));
                }}
                sx={{ width: '100%' }}
              />
              
              <TextField
                label="Site URL"
                value={settings.general?.siteUrl || ''}
                onChange={(e) => {
                  setSettingsData(prev => ({
                    ...prev,
                    general: {
                      ...prev.general,
                      siteUrl: e.target.value
                    }
                  }));
                }}
                sx={{ width: '100%' }}
              />
              
              <FormControl sx={{ width: '100%', marginBottom: 2 }}>
                <Select
                  label="Timezone"
                  value={settings.general?.timezone || 'UTC'}
                  onChange={(e) => {
                    setSettingsData(prev => ({
                      ...prev,
                      general: {
                        ...prev.general,
                        timezone: e.target.value
                      }
                    }));
                  }}
                  labelWidth={0}
                >
                  <MenuItem value="UTC">UTC</MenuItem>
                  <MenuItem value="America/New_York">Eastern Time (US)</MenuItem>
                  <MenuItem value="America/Los_Angeles">Pacific Time (US)</MenuItem>
                  <MenuItem value="Europe/London">London</MenuItem>
                  <MenuItem value="Europe/Paris">Paris</MenuItem>
                  <MenuItem value="Asia/Tokyo">Tokyo</MenuItem>
                  <MenuItem value="Asia/Shanghai">Shanghai</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl sx={{ width: '100%', marginBottom: 2 }}>
                <Select
                  label="Language"
                  value={settings.general?.language || 'en'}
                  onChange={(e) => {
                    setSettingsData(prev => ({
                      ...prev,
                      general: {
                        ...prev.general,
                        language: e.target.value
                      }
                    }));
                  }}
                  labelWidth={0}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                  <MenuItem value="de">German</MenuItem>
                  <MenuItem value="ja">Japanese</MenuItem>
                  <MenuItem value="zh">Chinese</MenuItem>
                </Select>
              </FormControl>
              
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Date Format"
                  value={settings.general?.dateFormat || 'YYYY-MM-DD'}
                  onChange={(e) => {
                    setSettingsData(prev => ({
                      ...prev,
                      general: {
                        ...prev.general,
                        dateFormat: e.target.value
                      }
                    }));
                  }}
                />
                
                <TextField
                  label="Time Format"
                  value={settings.general?.timeFormat || 'HH:mm:ss'}
                  onChange={(e) => {
                    setSettingsData(prev => ({
                      ...prev,
                      general: {
                        ...prev.general,
                        timeFormat: e.target.value
                      }
                    }));
                  }}
                />
              </Stack>
            </Stack>
          </CardContent>
          <Box sx={{ mt: 3, textAlign: 'right' }}>
            <Button variant="outlined" size="small" onClick={handleReset}>
              <RefreshIcon fontSize="small" /> Reset to Defaults
            </Button>
            <Button variant="contained" size="small" sx={{ ml: 2 }} disabled={isSaving} onClick={handleSave}>
              {isSaving ? 'Saving...' : 'Save Settings'}
              {!isSaving && <SaveIcon fontSize="small" />}
            </Button>
          </Box>
        </Card>
      )}
      
      {activeTab === 1 && (
        <Card sx={{ height: '100%' }}>
          <CardHeader title="Notification Settings" />
          <CardContent>
            <Stack spacing={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications?.emailEnabled ?? true}
                    onChange={(e) => {
                      setSettingsData(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          emailEnabled: e.target.checked
                        }
                      }));
                    }}
                  />
                }
                label="Email Notifications"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications?.slackEnabled ?? false}
                    onChange={(e) => {
                      setSettingsData(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          slackEnabled: e.target.checked
                        }
                      }));
                    }}
                  />
                }
                label="Slack Notifications"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.notifications?.webhookEnabled ?? false}
                    onChange={(e) => {
                      setSettingsData(prev => ({
                        ...prev,
                        notifications: {
                          ...prev.notifications,
                          webhookEnabled: e.target.checked
                        }
                      }));
                    }}
                  />
                }
                label="Webhook Notifications"
              />
              
              {settings.notifications?.webhookEnabled && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Webhook URL"
                    placeholder="Enter webhook URL for notifications"
                    value={settings.integrations?.webhookUrl || ''}
                    onChange={(e) => {
                      setSettingsData(prev => ({
                        ...prev,
                        integrations: {
                          ...prev.integrations,
                          webhookUrl: e.target.value
                        }
                      }));
                    }}
                    sx={{ width: '100%' }}
                  />
                </Box>
              )}
              
              <FormControl sx={{ width: '100%', marginBottom: 2 }}>
                <Select
                  label="Alert Threshold (%)"
                  value={settings.notifications?.alertThreshold || 80}
                  onChange={(e) => {
                    setSettingsData(prev => ({
                      ...prev,
                      notifications: {
                        ...prev.notifications,
                        alertThreshold: parseInt(e.target.value) || 80
                      }
                      }));
                  }}
                  labelWidth={0}
                >
                  {[50, 60, 70, 75, 80, 85, 90, 95].map(value => (
                    <MenuItem key={value} value={value}>
                      {value}%
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
          <Box sx={{ mt: 3, textAlign: 'right' }}>
            <Button variant="outlined" size="small" onClick={handleReset}>
              <RefreshIcon fontSize="small" /> Reset to Defaults
            </Button>
            <Button variant="contained" size="small" sx={{ ml: 2 }} disabled={isSaving} onClick={handleSave}>
              {isSaving ? 'Saving...' : 'Save Settings'}
              {!isSaving && <SaveIcon fontSize="small" />}
            </Button>
          </Box>
        </Card>
      )}
      
      {activeTab === 2 && (
        <Card sx={{ height: '100%' }}>
          <CardHeader title="Security Settings" />
          <CardContent>
            <Stack spacing={3}>
              <FormControl sx={{ width: '100%', marginBottom: 2 }}>
                <Select
                  label="Session Timeout (minutes)"
                  value={settings.security?.sessionTimeout || 30}
                  onChange={(e) => {
                    setSettingsData(prev => ({
                      ...prev,
                      security: {
                        ...prev.security,
                        sessionTimeout: parseInt(e.target.value) || 30
                      }
                      }));
                  }}
                  labelWidth={0}
                >
                  <MenuItem value="15">15 minutes</MenuItem>
                  <MenuItem value="30">30 minutes</MenuItem>
                  <MenuItem value="60">1 hour</MenuItem>
                  <MenuItem value="120">2 hours</MenuItem>
                  <MenuItem value="240">4 hours</MenuItem>
                  <MenuItem value="480">8 hours</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl sx={{ width: '100%', marginBottom: 2 }}>
                <Select
                  label="Max Login Attempts"
                  value={settings.security?.maxLoginAttempts || 5}
                  onChange={(e) => {
                    setSettingsData(prev => ({
                      ...prev,
                      security: {
                        ...prev.security,
                        maxLoginAttempts: parseInt(e.target.value) || 5
                      }
                      }));
                  }}
                  labelWidth={0}
                >
                  <MenuItem value="3">3 attempts</MenuItem>
                  <MenuItem value="5">5 attempts</MenuItem>
                  <MenuItem value="10">10 attempts</MenuItem>
                  <MenuItem value="15">15 attempts</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl sx={{ width: '100%', marginBottom: 2 }}>
                <Select
                  label="Password Policy"
                  value={settings.security?.passwordPolicy || 'strong'}
                  onChange={(e) => {
                    setSettingsData(prev => ({
                      ...prev,
                      security: {
                        ...prev.security,
                        passwordPolicy: e.target.value
                      }
                      }));
                  }}
                  labelWidth={0}
                >
                  <MenuItem value="none">None</MenuItem>
                  <MenuItem value="weak">Weak</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="strong">Strong</MenuItem>
                  <MenuItem value="enterprise">Enterprise</MenuItem>
                </Select>
              </FormControl>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.security?.twoFactorEnabled ?? false}
                    onChange={(e) => {
                      setSettingsData(prev => ({
                        ...prev,
                        security: {
                          ...prev.security,
                          twoFactorEnabled: e.target.checked
                        }
                      }));
                    }}
                  />
                }
                label="Two-Factor Authentication"
              />
            </Stack>
          </CardContent>
          <Box sx={{ mt: 3, textAlign: 'right' }}>
            <Button variant="outlined" size="small" onClick={handleReset}>
              <RefreshIcon fontSize="small" /> Reset to Defaults
            </Button>
            <Button variant="contained" size="small" sx={{ ml: 2 }} disabled={isSaving} onClick={handleSave}>
              {isSaving ? 'Saving...' : 'Save Settings'}
              {!isSaving && <SaveIcon fontSize="small" />}
            </Button>
          </Box>
        </Card>
      )}
      
      {activeTab === 3 && (
        <Card sx={{ height: '100%' }}>
          <CardHeader title="Performance Settings" />
          <CardContent>
            <Stack spacing={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.performance?.cacheEnabled ?? true}
                    onChange={(e) => {
                      setSettingsData(prev => ({
                        ...prev,
                        performance: {
                          ...prev.performance,
                          cacheEnabled: e.target.checked
                        }
                      }));
                    }}
                  />
                }
                label="Enable Caching"
              />
              
              {settings.performance?.cacheEnabled && (
                <Box sx={{ mt: 2 }}>
                  <FormControl sx={{ width: '100%', marginBottom: 2 }}>
                    <Select
                      label="Cache TTL (seconds)"
                      value={settings.performance?.cacheTTL || 300}
                      onChange={(e) => {
                        setSettingsData(prev => ({
                          ...prev,
                          performance: {
                            ...prev.performance,
                            cacheTTL: parseInt(e.target.value) || 300
                          }
                      }));
                      }}
                      labelWidth={0}
                    >
                      <MenuItem value="60">1 minute</MenuItem>
                      <MenuItem value="300">5 minutes</MenuItem>
                      <MenuItem value="600">10 minutes</MenuItem>
                      <MenuItem value="1800">30 minutes</MenuItem>
                      <MenuItem value="3600">1 hour</MenuItem>
                      <MenuItem value="7200">2 hours</MenuItem>
                    </Select>
                  </FormControl>
                  </Box>
                )}
              <FormControlLabel
                label="Enable Response Compression"
                control={
                  <Switch
                    checked={settings.performance?.compressionEnabled ?? true}
                    onChange={(e) => {
                      setSettingsData(prev => ({
                        ...prev,
                        performance: {
                          ...prev.performance,
                          compressionEnabled: e.target.checked
                        }
                      }));
                    }}
                  />
                }
              />
              
              <FormControl sx={{ width: '100%', marginBottom: 2 }}>
                <Select
                  label="Max Worker Processes"
                  value={settings.performance?.maxWorkers || 4}
                    onChange={(e) => {
                      setSettingsData(prev => ({
                        ...prev,
                        performance: {
                          ...prev.performance,
                          maxWorkers: parseInt(e.target.value) || 4
                        }
                      }));
                    }}
                  labelWidth={0}
                >
                  <MenuItem value="1">1 worker</MenuItem>
                  <MenuItem value="2">2 workers</MenuItem>
                  <MenuItem value="4">4 workers</MenuItem>
                  <MenuItem value="8">8 workers</MenuItem>
                  <MenuItem value="16">16 workers</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </CardContent>
          <Box sx={{ mt: 3, textAlign: 'right' }}>
            <Button variant="outlined" size="small" onClick={handleReset}>
              <RefreshIcon fontSize="small" /> Reset to Defaults
            </Button>
            <Button variant="contained" size="small" sx={{ ml: 2 }} disabled={isSaving} onClick={handleSave}>
              {isSaving ? 'Saving...' : 'Save Settings'}
              {!isSaving && <SaveIcon fontSize="small" />}
            </Button>
          </Box>
        </Card>
      )}
      
      {activeTab === 4 && (
        <Card sx={{ height: '100%' }}>
          <CardHeader title="Integration Settings" />
          <CardContent>
            <Stack spacing={3}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.integrations?.prometheusEnabled ?? true}
                    onChange={(e) => {
                      setSettingsData(prev => ({
                        ...prev,
                        integrations: {
                          ...prev.integrations,
                          prometheusEnabled: e.target.checked
                        }
                      }));
                    }}
                  />
                }
                label="Prometheus Monitoring"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.integrations?.grafanaEnabled ?? true}
                    onChange={(e) => {
                      setSettingsData(prev => ({
                        ...prev,
                        integrations: {
                          ...prev.integrations,
                          grafanaEnabled: e.target.checked
                        }
                      }));
                    }}
                  />
                }
                label="Grafana Dashboards"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.integrations?.elkEnabled ?? true}
                    onChange={(e) => {
                      setSettingsData(prev => ({
                        ...prev,
                        integrations: {
                          ...prev.integrations,
                          elkEnabled: e.target.checked
                        }
                      }));
                    }}
                  />
                }
                label="ELK Stack (Logging)"
              />
              
              <Box sx={{ mt: 2 }}>
                <TextField
                  label="Custom Webhook URL"
                  placeholder="Enter URL for custom integrations"
                  value={settings.integrations?.webhookUrl || ''}
                  onChange={(e) => {
                    setSettingsData(prev => ({
                      ...prev,
                      integrations: {
                        ...prev.integrations,
                        webhookUrl: e.target.value
                      }
                    }));
                  }}
                  sx={{ width: '100%' }}
                />
              </Box>
            </Stack>
          </CardContent>
          <Box sx={{ mt: 3, textAlign: 'right' }}>
            <Button variant="outlined" size="small" onClick={handleReset}>
              <RefreshIcon fontSize="small" /> Reset to Defaults
            </Button>
            <Button variant="contained" size="small" sx={{ ml: 2 }} disabled={isSaving} onClick={handleSave}>
              {isSaving ? 'Saving...' : 'Save Settings'}
              {!isSaving && <SaveIcon fontSize="small" />}
            </Button>
          </Box>
        </Card>
      )}
    </Container>
  );
};

export default Settings;
