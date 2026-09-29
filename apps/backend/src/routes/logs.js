const express = require('express');
const router = express.Router();
const { Parser } = require('json2csv');

// Mock logs data
let logsData = [];
const logLevels = ['ERROR', 'WARN', 'INFO', 'DEBUG'];
const services = ['frontend-service', 'backend-api', 'database-primary', 'redis-cache', 'api-gateway', 'message-queue'];
const hosts = ['host-001', 'host-002', 'host-003', 'host-004', 'host-005'];

// Generate initial mock logs
function generateMockLogs(count = 100) {
  const logs = [];
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);
    const secondsAgo = Math.floor(Math.random() * 60);
    const timestamp = new Date(now - (hoursAgo * 3600000 + minutesAgo * 60000 + secondsAgo * 1000));
    
    const level = logLevels[Math.floor(Math.random() * logLevels.length)];
    const service = services[Math.floor(Math.random() * services.length)];
    const host = hosts[Math.floor(Math.random() * hosts.length)];
    
    let message = '';
    switch (level) {
      case 'ERROR':
        const errorMessages = [
          'Connection timeout to database',
          'Failed to process payment transaction',
          'NullPointerException in user service',
          'Database connection pool exhausted',
          'Invalid JWT token provided',
          'Failed to connect to external API',
          'OutOfMemoryError: Java heap space',
          'Disk write failed: No space left on device',
          'SSL handshake failed',
          'Circular dependency detected'
        ];
        message = errorMessages[Math.floor(Math.random() * errorMessages.length)];
        break;
      case 'WARN':
        const warnMessages = [
          'High memory usage detected: 85%',
          'Slow query detected: >5s execution time',
          'Deprecated API endpoint accessed',
          'Cache miss rate increased to 40%',
          'Disk usage above 80% threshold',
          'Unusual traffic spike detected',
          'SSL certificate expires in 30 days',
          'Backup job took longer than expected',
          'Rate limit approaching limit',
          'Duplicate log entries detected'
        ];
        message = warnMessages[Math.floor(Math.random() * warnMessages.length)];
        break;
      case 'INFO':
        const infoMessages = [
          'User login successful',
          'New service instance started',
          'Configuration reloaded successfully',
          'Backup completed successfully',
          'Cache warmed up successfully',
          'Database migration applied',
          'SSL certificate renewed',
          'New feature flag enabled',
          'Batch job completed successfully',
          'Health check passed'
        ];
        message = infoMessages[Math.floor(Math.random() * infoMessages.length)];
        break;
      case 'DEBUG':
        const debugMessages = [
          'Entering method: processUserRequest',
          'Variable userId = 12345',
          'Executing SQL: SELECT * FROM users WHERE id = ?',
          'Cache key generated: user:12345:profile',
          'HTTP request headers: {...}',
          'Response status code: 200',
          'Exiting method: processUserRequest',
          'Transaction began: isolationLevel=READ_COMMITTED',
          'Prepared statement created',
          'ResultSet closed successfully'
        ];
        message = debugMessages[Math.floor(Math.random() * debugMessages.length)];
        break;
    }
    
    logs.push({
      id: `log-${String(i + 1).padStart(6, '0')}`,
      timestamp: timestamp.toISOString(),
      level,
      service,
      host,
      message,
      // Additional fields for rich log data
      metadata: {
        traceId: Math.random().toString(36).substring(2, 15),
        spanId: Math.random().toString(36).substring(2, 10),
        userId: Math.floor(Math.random() * 10000),
        sessionId: Math.random().toString(36).substring(2, 15),
        ipAddress: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        requestId: `req-${Math.random().toString(36).substring(2, 12)}`,
        durationMs: Math.floor(Math.random() * 5000)
      }
    });
  }
  
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Newest first
}

// Initialize logs
logsData = generateMockLogs(500);

// Get logs with filtering and pagination
router.get('/', (req, res) => {
  try {
    const { search, level, service, host, startTime, endTime, limit, offset, sort } = req.query;
    
    let filteredLogs = [...logsData];
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredLogs = filteredLogs.filter(log =>
        log.message.toLowerCase().includes(searchLower) ||
        log.service.toLowerCase().includes(searchLower) ||
        log.host.toLowerCase().includes(searchLower) ||
        (log.metadata && (
          log.metadata.userId && String(log.metadata.userId).includes(searchLower) ||
          log.metadata.ipAddress && log.metadata.ipAddress.includes(searchLower)
        ))
      );
    }
    
    // Apply level filter
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level.toUpperCase());
    }
    
    // Apply service filter
    if (service) {
      filteredLogs = filteredLogs.filter(log => log.service.toLowerCase() === service.toLowerCase());
    }
    
    // Apply host filter
    if (host) {
      filteredLogs = filteredLogs.filter(log => log.host.toLowerCase() === host.toLowerCase());
    }
    
    // Apply time range filter
    if (startTime) {
      const startDate = new Date(startTime);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= startDate);
    }
    
    if (endTime) {
      const endDate = new Date(endTime);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= endDate);
    }
    
    // Apply sorting
    if (sort) {
      const [field, order] = sort.split(':');
      filteredLogs.sort((a, b) => {
        if (order === 'desc') {
          return new Date(b[field]) - new Date(a[field]);
        } else {
          return new Date(a[field]) - new Date(b[field]);
        }
      });
    } else {
      // Default sort by timestamp descending
      filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
    
    // Apply pagination
    const limitInt = parseInt(limit) || 100;
    const offsetInt = parseInt(offset) || 0;
    
    const paginatedLogs = filteredLogs.slice(offsetInt, offsetInt + limitInt);
    
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      count: filteredLogs.length,
      total: logsData.length,
      limit: limitInt,
      offset: offsetInt,
      data: paginatedLogs
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get log statistics
router.get('/stats', (req, res) => {
  try {
    const { startTime, endTime } = req.query;
    
    let logsToAnalyze = [...logsData];
    
    // Apply time range filter if provided
    if (startTime) {
      const startDate = new Date(startTime);
      logsToAnalyze = logsToAnalyze.filter(log => new Date(log.timestamp) >= startDate);
    }
    
    if (endTime) {
      const endDate = new Date(endTime);
      logsToAnalyze = logsToAnalyze.filter(log => new Date(log.timestamp) <= endDate);
    }
    
    // Calculate statistics
    const stats = {
      totalLogs: logsToAnalyze.length,
      byLevel: {},
      byService: {},
      byHost: {},
      timeRange: {
        start: startTime || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Last 24 hours
        end: endTime || new Date().toISOString()
      },
      trends: {
        hourly: Array(24).fill(0), // Last 24 hours
        daily: Array(7).fill(0)    // Last 7 days
      }
    };
    
    // Count by level
    logLevels.forEach(level => {
      stats.byLevel[level] = logsToAnalyze.filter(log => log.level === level).length;
    });
    
    // Count by service
    services.forEach(service => {
      stats.byService[service] = logsToAnalyze.filter(log => log.service.toLowerCase() === service.toLowerCase()).length;
    });
    
    // Count by host
    hosts.forEach(host => {
      stats.byHost[host] = logsToAnalyze.filter(log => log.host.toLowerCase() === host.toLowerCase()).length;
    });
    
    // Calculate hourly trends (last 24 hours)
    const now = Date.now();
    logsToAnalyze.forEach(log => {
      const hoursAgo = Math.floor((now - new Date(log.timestamp)) / 3600000);
      if (hoursAgo >= 0 && hoursAgo < 24) {
        stats.trends.hourly[23 - hoursAgo]++; // Most recent first
      }
    });
    
    // Calculate daily trends (last 7 days)
    logsToAnalyze.forEach(log => {
      const daysAgo = Math.floor((now - new Date(log.timestamp)) / (24 * 3600000));
      if (daysAgo >= 0 && daysAgo < 7) {
        stats.trends.daily[6 - daysAgo]++; // Most recent first
      }
    });
    
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      data: stats
    });
  } catch (error) {
    console.error('Error fetching log statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Export logs as CSV
router.get('/export/csv', (req, res) => {
  try {
    const { search, level, service, host, startTime, endTime } = req.query;
    
    let filteredLogs = [...logsData];
    
    // Apply same filters as in GET /logs
    if (search) {
      const searchLower = search.toLowerCase();
      filteredLogs = filteredLogs.filter(log =>
        log.message.toLowerCase().includes(searchLower) ||
        log.service.toLowerCase().includes(searchLower) ||
        log.host.toLowerCase().includes(searchLower)
      );
    }
    
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level.toUpperCase());
    }
    
    if (service) {
      filteredLogs = filteredLogs.filter(log => log.service.toLowerCase() === service.toLowerCase());
    }
    
    if (host) {
      filteredLogs = filteredLogs.filter(log => log.host.toLowerCase() === host.toLowerCase());
    }
    
    if (startTime) {
      const startDate = new Date(startTime);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= startDate);
    }
    
    if (endTime) {
      const endDate = new Date(endTime);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= endDate);
    }
    
    // Select fields for CSV export
    const csvFields = [
      { label: 'ID', value: 'id' },
      { label: 'Timestamp', value: 'timestamp' },
      { label: 'Level', value: 'level' },
      { label: 'Service', value: 'service' },
      { label: 'Host', value: 'host' },
      { label: 'Message', value: 'message' }
    ];
    
    const json2csvParser = new Parser({ fields: csvFields });
    const csv = json2csvParser.parse(filteredLogs);
    
    res.header('Content-Type', 'text/csv');
    res.attachment(`logs-${new Date().toISOString().slice(0, 10)}.csv`);
    return res.send(csv);
  } catch (error) {
    console.error('Error exporting logs as CSV:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get unique values for filtering
router.get('/filters', (req, res) => {
  try {
    const uniqueServices = [...new Set(logsData.map(log => log.service))].sort();
    const uniqueHosts = [...new Set(logsData.map(log => log.host))].sort();
    
    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        levels: logLevels,
        services: uniqueServices,
        hosts: uniqueHosts
      }
    });
  } catch (error) {
    console.error('Error fetching filter options:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Add a new log entry (for testing)
router.post('/', (req, res) => {
  try {
    const { level, service, host, message } = req.body;
    
    // Validation
    if (!level || !service || !host || !message) {
      return res.status(400).json({
        success: false,
        message: 'Level, service, host, and message are required'
      });
    }
    
    if (!logLevels.includes(level.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid level. Must be one of: ${logLevels.join(', ')}`
      });
    }
    
    const newLog = {
      id: `log-${String(logsData.length + 1).padStart(6, '0')}`,
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      service,
      host,
      message,
      metadata: {
        traceId: Math.random().toString(36).substring(2, 15),
        spanId: Math.random().toString(36).substring(2, 10),
        userId: Math.floor(Math.random() * 10000),
        sessionId: Math.random().toString(36).substring(2, 15),
        ipAddress: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        requestId: `req-${Math.random().toString(36).substring(2, 12)}`,
        durationMs: Math.floor(Math.random() * 5000)
      }
    };
    
    logsData.unshift(newLog); // Add to beginning (most recent)
    
    // Keep only last 1000 logs to prevent memory issues
    if (logsData.length > 1000) {
      logsData = logsData.slice(0, 1000);
    }
    
    res.status(201).json({
      success: true,
      message: 'Log entry added successfully',
      data: newLog
    });
  } catch (error) {
    console.error('Error adding log entry:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
