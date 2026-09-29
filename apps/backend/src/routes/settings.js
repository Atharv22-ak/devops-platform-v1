const express = require('express');
const router = express.Router();

// Mock settings data (in real app, this would be stored in database)
let settings = {
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
    alertThreshold: 80,
    webhookUrl: ''
  },
  security: {
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordPolicy: 'strong',
    twoFactorEnabled: false,
    passwordHistory: 5
  },
  performance: {
    cacheEnabled: true,
    cacheTTL: 300,
    compressionEnabled: true,
    maxWorkers: 4,
    enableLogging: true
  },
  integrations: {
    prometheusEnabled: true,
    grafanaEnabled: true,
    elkEnabled: true,
    webhookUrl: '',
    customMetrics: []
  },
  // Internal settings not exposed via API
  _internal: {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    maintenanceMode: false
  }
};

// Get all settings
router.get('/', (req, res) => {
  try {
    // Return settings without internal fields
    const { _internal, ...publicSettings } = settings;
    
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      data: publicSettings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get specific settings section
router.get('/:section', (req, res) => {
  try {
    const { section } = req.params;
    
    if (!settings.hasOwnProperty(section)) {
      return res.status(400).json({
        success: false,
        message: `Invalid settings section: ${section}`
      });
    }
    
    // Don't expose internal settings
    if (section === '_internal') {
      return res.status(403).json({
        success: false,
        message: 'Access to internal settings is forbidden'
      });
    }
    
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      data: settings[section]
    });
  } catch (error) {
    console.error('Error fetching settings section:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update settings
router.put('/', (req, res) => {
  try {
    const { general, notifications, security, performance, integrations } = req.body;
    
    // Update only allowed sections
    if (general !== undefined) {
      settings.general = { ...settings.general, ...general };
    }
    
    if (notifications !== undefined) {
      settings.notifications = { ...settings.notifications, ...notifications };
    }
    
    if (security !== undefined) {
      settings.security = { ...settings.security, ...security };
    }
    
    if (performance !== undefined) {
      settings.performance = { ...settings.performance, ...performance };
    }
    
    if (integrations !== undefined) {
      settings.integrations = { ...settings.integrations, ...integrations };
    }
    
    // Update internal metadata
    settings._internal.lastUpdated = new Date().toISOString();
    
    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      timestamp: new Date().toISOString(),
      data: {
        general: settings.general,
        notifications: settings.notifications,
        security: settings.security,
        performance: settings.performance,
        integrations: settings.integrations
      }
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update specific settings section
router.put('/:section', (req, res) => {
  try {
    const { section } = req.params;
    const updates = req.body;
    
    // Validate section
    if (!settings.hasOwnProperty(section)) {
      return res.status(400).json({
        success: false,
        message: `Invalid settings section: ${section}`
      });
    }
    
    // Don't allow updating internal settings via API
    if (section === '_internal') {
      return res.status(403).json({
        success: false,
        message: 'Access to internal settings is forbidden'
      });
    }
    
    // Update section
    settings[section] = { ...settings[section], ...updates };
    
    // Update internal metadata
    settings._internal.lastUpdated = new Date().toISOString();
    
    res.status(200).json({
      success: true,
      message: `${section} settings updated successfully`,
      timestamp: new Date().toISOString(),
      data: settings[section]
    });
  } catch (error) {
    console.error('Error updating settings section:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Reset settings to default
router.delete('/', (req, res) => {
  try {
    // Reset to default settings
    settings = {
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
        alertThreshold: 80,
        webhookUrl: ''
      },
      security: {
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        passwordPolicy: 'strong',
        twoFactorEnabled: false,
        passwordHistory: 5
      },
      performance: {
        cacheEnabled: true,
        cacheTTL: 300,
        compressionEnabled: true,
        maxWorkers: 4,
        enableLogging: true
      },
      integrations: {
        prometheusEnabled: true,
        grafanaEnabled: true,
        elkEnabled: true,
        webhookUrl: '',
        customMetrics: []
      },
      _internal: {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
        maintenanceMode: false
      }
    };
    
    res.status(200).json({
      success: true,
      message: 'Settings reset to default values',
      timestamp: new Date().toISOString(),
      data: {
        general: settings.general,
        notifications: settings.notifications,
        security: settings.security,
        performance: settings.performance,
        integrations: settings.integrations
      }
    });
  } catch (error) {
    console.error('Error resetting settings:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get settings metadata
router.get('/meta/info', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        version: settings._internal.version,
        lastUpdated: settings._internal.lastUpdated,
        maintenanceMode: settings._internal.maintenanceMode,
        // Available sections
        sections: Object.keys(settings).filter(key => key !== '_internal')
      }
    });
  } catch (error) {
    console.error('Error fetching settings metadata:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
