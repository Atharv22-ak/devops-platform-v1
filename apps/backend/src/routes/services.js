const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const nodeCache = require('node-cache');
const cache = new nodeCache({ stdTTL: 300, checkperiod: 120 }); // 5 minute default TTL

// Mock services data
let services = [
  {
    id: 'svc-001',
    name: 'frontend-service',
    type: 'web-application',
    version: '1.2.3',
    status: 'healthy',
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-27T08:30:00Z',
    resources: {
      cpuUsage: 25.4,
      memoryUsage: 512, // MB
      diskUsage: 2048, // MB
      networkIn: 10.5, // MB/s
      networkOut: 8.2, // MB/s
    },
    uptime: 99.8,
    tags: ['frontend', 'react', 'production'],
    dependencies: ['api-gateway', 'redis'],
    metadata: {
      repository: 'github.com/company/frontend-service',
      dockerImage: 'company/frontend-service:1.2.3',
      deploymentStrategy: 'rolling-update'
    }
  },
  {
    id: 'svc-002',
    name: 'backend-api',
    type: 'rest-api',
    version: '2.1.0',
    status: 'healthy',
    createdAt: '2026-09-01T10:05:00Z',
    updatedAt: '2026-09-27T08:25:00Z',
    resources: {
      cpuUsage: 45.2,
      memoryUsage: 1024, // MB
      diskUsage: 4096, // MB
      networkIn: 15.3, // MB/s
      networkOut: 12.7, // MB/s
    },
    uptime: 99.5,
    tags: ['backend', 'nodejs', 'api'],
    dependencies: ['postgresql', 'redis', 'mongodb'],
    metadata: {
      repository: 'github.com/company/backend-api',
      dockerImage: 'company/backend-api:2.1.0',
      deploymentStrategy: 'blue-green'
    }
  },
  {
    id: 'svc-003',
    name: 'database-primary',
    type: 'database',
    version: '13.4',
    status: 'healthy',
    createdAt: '2026-09-01T09:30:00Z',
    updatedAt: '2026-09-27T08:20:00Z',
    resources: {
      cpuUsage: 30.1,
      memoryUsage: 2048, // MB
      diskUsage: 10240, // MB
      networkIn: 5.2, // MB/s
      networkOut: 4.8, // MB/s
    },
    uptime: 99.9,
    tags: ['database', 'postgresql', 'primary'],
    dependencies: [],
    metadata: {
      repository: 'internal/postgresql-config',
      dockerImage: 'postgres:13.4',
      deploymentStrategy: 'stateful-set'
    }
  }
];

// Get all services with optional filtering
router.get('/', (req, res) => {
  try {
    const { search, type, status, tags } = req.query;
    
    let filteredServices = [...services];
    
    // Apply filters
    if (search) {
      const searchLower = search.toLowerCase();
      filteredServices = filteredServices.filter(service =>
        service.name.toLowerCase().includes(searchLower) ||
        service.type.toLowerCase().includes(searchLower) ||
        service.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    if (type) {
      filteredServices = filteredServices.filter(service => 
        service.type === type
      );
    }
    
    if (status) {
      filteredServices = filteredServices.filter(service => 
        service.status === status
      );
    }
    
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filteredServices = filteredServices.filter(service =>
        tagArray.some(tag => service.tags.includes(tag))
      );
    }
    
    // Apply pagination
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const paginatedServices = filteredServices.slice(offset, offset + limit);
    
    res.status(200).json({
      success: true,
      count: filteredServices.length,
      total: services.length,
      data: paginatedServices
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get service by ID
router.get('/:id', (req, res) => {
  try {
    const service = services.find(s => s.id === req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create new service
router.post('/', (req, res) => {
  try {
    const { name, type, version, tags, dependencies, metadata } = req.body;
    
    // Validation
    if (!name || !type || !version) {
      return res.status(400).json({
        success: false,
        message: 'Name, type, and version are required'
      });
    }
    
    // Check if service with same name already exists
    const existingService = services.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (existingService) {
      return res.status(409).json({
        success: false,
        message: 'Service with this name already exists'
      });
    }
    
    // Create new service
    const newService = {
      id: `svc-${String(services.length + 1).padStart(3, '0')}`,
      name,
      type: type || 'unknown',
      version: version || '1.0.0',
      status: 'creating',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resources: {
        cpuUsage: 0,
        memoryUsage: 0,
        diskUsage: 0,
        networkIn: 0,
        networkOut: 0,
      },
      uptime: 0,
      tags: Array.isArray(tags) ? tags : [],
      dependencies: Array.isArray(dependencies) ? dependencies : [],
      metadata: metadata || {}
    };
    
    services.push(newService);
    
    // Clear cache
    cache.flushAll();
    
    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: newService
    });
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update service
router.put('/:id', (req, res) => {
  try {
    const serviceIndex = services.findIndex(s => s.id === req.params.id);
    
    if (serviceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    const { name, type, version, status, tags, dependencies, metadata, resources } = req.body;
    
    // Update service
    services[serviceIndex] = {
      ...services[serviceIndex],
      ...(name !== undefined && { name }),
      ...(type !== undefined && { type }),
      ...(version !== undefined && { version }),
      ...(status !== undefined && { status }),
      ...(tags !== undefined && { tags: Array.isArray(tags) ? tags : services[serviceIndex].tags }),
      ...(dependencies !== undefined && { dependencies: Array.isArray(dependencies) ? dependencies : services[serviceIndex].dependencies }),
      ...(metadata !== undefined && { metadata: { ...services[serviceIndex].metadata, ...metadata } }),
      ...(resources !== undefined && { resources: { ...services[serviceIndex].resources, ...resources } }),
      updatedAt: new Date().toISOString()
    };
    
    // Clear cache
    cache.flushAll();
    
    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: services[serviceIndex]
    });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Delete service
router.delete('/:id', (req, res) => {
  try {
    const serviceIndex = services.findIndex(s => s.id === req.params.id);
    
    if (serviceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    const deletedService = services.splice(serviceIndex, 1)[0];
    
    // Clear cache
    cache.flushAll();
    
    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
      data: deletedService
    });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get service metrics
router.get('/:id/metrics', (req, res) => {
  try {
    const service = services.find(s => s.id === req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    // Generate mock metrics data
    const metrics = {
      serviceId: service.id,
      timestamp: new Date().toISOString(),
      resources: {
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * service.resources.memoryUsage * 2,
        diskUsage: Math.random() * service.resources.diskUsage * 1.5,
        networkIn: Math.random() * 50,
        networkOut: Math.random() * 40,
      },
      uptime: Math.min(99.9, service.uptime + (Math.random() - 0.5) * 2),
      responseTime: Math.random() * 200, // ms
      requestRate: Math.random() * 1000, // requests per minute
      errorRate: Math.random() * 5, // percentage
    };
    
    res.status(200).json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error fetching service metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Simulate service status change
router.post('/:id/status', (req, res) => {
  try {
    const service = services.find(s => s.id === req.params.id);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }
    
    const { status } = req.body;
    
    if (!status || !['healthy', 'warning', 'critical', 'unknown'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required: healthy, warning, critical, or unknown'
      });
    }
    
    // Update service status
    service.status = status;
    service.updatedAt = new Date().toISOString();
    
    // Clear cache
    cache.flushAll();
    
    res.status(200).json({
      success: true,
      message: `Service status updated to ${status}`,
      data: service
    });
  } catch (error) {
    console.error('Error updating service status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
