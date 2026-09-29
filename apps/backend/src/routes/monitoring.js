const express = require('express');
const router = express.Router();
const nodeCache = require('node-cache');
const cache = new nodeCache({ stdTTL: 60, checkperiod: 15 }); // 1 minute default TTL for monitoring data

// Mock monitoring data
let monitoringData = {
  prometheus: {
    status: 'active',
    lastScrape: new Date(Date.now() - 30000).toISOString(), // 30 seconds ago
    targets: {
      total: 15,
      up: 14,
      down: 1,
      unchecked: 0
    },
    alerts: {
      firing: 2,
      pending: 1,
      inhibited: 0
    },
    storage: {
      chunks: 1250000,
      series: 8900000,
      memoryUsage: '2.4GB'
    }
  },
  grafana: {
    status: 'active',
    version: '9.4.0',
    users: {
      total: 12,
      online: 8,
      admins: 2,
      editors: 5
    },
    dashboards: {
      total: 45,
      starred: 12,
      updatedToday: 3
    },
    annotations: {
      total: 1250,
      today: 45
    }
  },
  elk: {
    status: 'active',
    elasticsearch: {
      clusterName: 'devops-cluster',
      status: 'green',
      nodes: {
        total: 3,
        data: 2,
        master: 1,
        ingest: 0
      },
      indices: {
        count: 25,
        documents: 12500000,
        deleted: 125000,
        storageSize: '45.2GB'
      },
      jvm: {
        maxMemory: '4GB',
        usedMemory: '2.1GB'
      }
    },
    logstash: {
      pipeline: {
        workers: 2,
        batchSize: 125,
        batchDelay: 5
      },
      plugins: {
        input: 3,
        filter: 5,
        output: 2
      }
    },
    kibana: {
      version: '8.6.0',
      status: 'active',
      optimizedPlugins: [
        'discover',
        'visualize',
        'dashboard',
        'dev_tools'
      ]
    }
  },
  system: {
    cpuUsage: Math.floor(Math.random() * 80),
    memoryUsage: Math.floor(Math.random() * 90),
    diskUsage: Math.floor(Math.random() * 85),
    networkIn: Math.floor(Math.random() * 1000), // KB/s
    networkOut: Math.floor(Math.random() * 800),  // KB/s
    loadAverage: [
      Math.random() * 2,
      Math.random() * 2,
      Math.random() * 2
    ],
    uptime: process.uptime()
  }
};

// Get all monitoring data
router.get('/', (req, res) => {
  try {
    // Update system data with current values
    monitoringData.system = {
      cpuUsage: Math.floor(Math.random() * 80),
      memoryUsage: Math.floor(Math.random() * 90),
      diskUsage: Math.floor(Math.random() * 85),
      networkIn: Math.floor(Math.random() * 1000), // KB/s
      networkOut: Math.floor(Math.random() * 800),  // KB/s
      loadAverage: [
        Math.random() * 2,
        Math.random() * 2,
        Math.random() * 2
      ],
      uptime: process.uptime()
    };
    
    // Update timestamps
    monitoringData.prometheus.lastScrape = new Date(Date.now() - Math.floor(Math.random() * 30000)).toISOString();
    monitoringData.grafana.version = '9.4.0';
    monitoringData.elk.elasticsearch.status = ['green', 'yellow', 'red'][Math.floor(Math.random() * 3)];
    
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      data: monitoringData
    });
  } catch (error) {
    console.error('Error fetching monitoring data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get Prometheus-specific data
router.get('/prometheus', (req, res) => {
  try {
    const prometheusData = {
      ...monitoringData.prometheus,
      lastScrape: new Date(Date.now() - Math.floor(Math.random() * 30000)).toISOString(),
      targets: {
        total: 15 + Math.floor(Math.random() * 5),
        up: 14 + Math.floor(Math.random() * 3),
        down: Math.floor(Math.random() * 2),
        unchecked: 0
      },
      alerts: {
        firing: Math.floor(Math.random() * 5),
        pending: Math.floor(Math.random() * 3),
        inhibited: Math.floor(Math.random() * 2)
      }
    };
    
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      data: prometheusData
    });
  } catch (error) {
    console.error('Error fetching Prometheus data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get Grafana-specific data
router.get('/grafana', (req, res) => {
  try {
    const grafanaData = {
      ...monitoringData.grafana,
      users: {
        total: 12 + Math.floor(Math.random() * 8),
        online: 8 + Math.floor(Math.random() * 4),
        admins: 2 + Math.floor(Math.random() * 2),
        editors: 5 + Math.floor(Math.random() * 5)
      },
      dashboards: {
        total: 45 + Math.floor(Math.random() * 15),
        starred: 12 + Math.floor(Math.random() * 8),
        updatedToday: Math.floor(Math.random() * 5)
      }
    };
    
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      data: grafanaData
    });
  } catch (error) {
    console.error('Error fetching Grafana data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get ELK-specific data
router.get('/elk', (req, res) => {
  try {
    const elkData = {
      ...monitoringData.elk,
      elasticsearch: {
        ...monitoringData.elk.elasticsearch,
        status: ['green', 'yellow', 'red'][Math.floor(Math.random() * 3)],
        nodes: {
          total: 3 + Math.floor(Math.random() * 2),
          data: 2 + Math.floor(Math.random() * 2),
          master: 1,
          ingest: Math.floor(Math.random() * 2)
        },
        indices: {
          count: 25 + Math.floor(Math.random() * 10),
          documents: 12500000 + Math.floor(Math.random() * 1000000),
          deleted: 125000 + Math.floor(Math.random() * 10000),
          storageSize: `${45 + Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 9)}GB`
        }
      }
    };
    
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      data: elkData
    });
  } catch (error) {
    console.error('Error fetching ELK data:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get system metrics
router.get('/system', (req, res) => {
  try {
    const systemData = {
      cpuUsage: Math.floor(Math.random() * 80),
      memoryUsage: Math.floor(Math.random() * 90),
      diskUsage: Math.floor(Math.random() * 85),
      networkIn: Math.floor(Math.random() * 1000), // KB/s
      networkOut: Math.floor(Math.random() * 800),  // KB/s
      loadAverage: [
        Math.random() * 2,
        Math.random() * 2,
        Math.random() * 2
      ],
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
    
    res.status(200).json({
      success: true,
      data: systemData
    });
  } catch (error) {
    console.error('Error fetching system metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get alerts
router.get('/alerts', (req, res) => {
  try {
    // Generate mock alerts
    const alerts = [
      {
        id: 'alert-001',
        name: 'High CPU Usage',
        severity: 'warning',
        service: 'backend-api',
        description: 'CPU usage exceeded 80% threshold for 5 minutes',
        startTime: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
        endTime: null,
        labels: {
          alertname: 'HighCPUUsage',
          service: 'backend-api',
          severity: 'warning'
        },
        annotations: {
          summary: 'High CPU usage detected',
          description: 'CPU usage is above 80% for more than 5 minutes'
        }
      },
      {
        id: 'alert-002',
        name: 'Disk Space Critical',
        severity: 'critical',
        service: 'database-primary',
        description: 'Disk usage exceeded 95% threshold',
        startTime: new Date(Date.now() - 2 * 60000).toISOString(), // 2 minutes ago
        endTime: null,
        labels: {
          alertname: 'DiskSpaceCritical',
          service: 'database-primary',
          severity: 'critical'
        },
        annotations: {
          summary: 'Critical disk space usage',
          description: 'Disk usage is above 95% requiring immediate attention'
        }
      }
    ];
    
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get service dependencies graph
router.get('/dependencies', (req, res) => {
  try {
    // Generate mock dependency graph
    const nodes = [
      { id: 'frontend-service', type: 'web-application', status: 'healthy' },
      { id: 'backend-api', type: 'rest-api', status: 'healthy' },
      { id: 'database-primary', type: 'database', status: 'healthy' },
      { id: 'redis-cache', type: 'cache', status: 'healthy' },
      { id: 'api-gateway', type: 'gateway', status: 'healthy' },
      { id: 'message-queue', type: 'queue', status: 'warning' },
      { id: 'load-balancer', type: 'network', status: 'healthy' }
    ];
    
    const edges = [
      { from: 'frontend-service', to: 'backend-api', type: 'api-call' },
      { from: 'backend-api', to: 'database-primary', type: 'database-query' },
      { from: 'backend-api', to: 'redis-cache', type: 'cache-access' },
      { from: 'frontend-service', to: 'api-gateway', type: 'traffic' },
      { from: 'api-gateway', to: 'backend-api', type: 'traffic' },
      { from: 'backend-api', to: 'message-queue', type: 'message-publish' },
      { from: 'message-queue', to: 'backend-api', type: 'message-consume' },
      { from: 'load-balancer', to: 'frontend-service', type: 'traffic-distribution' },
      { from: 'load-balancer', to: 'api-gateway', type: 'traffic-distribution' }
    ];
    
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        nodes,
        edges
      }
    });
  } catch (error) {
    console.error('Error fetching dependency graph:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
