# DevOps Practice Platform

A comprehensive DevOps practice platform designed for resume-building and skill demonstration. This platform includes:

- **Frontend**: Modern React/Vite application with Material-UI
- **Backend**: Node.js/Express API with comprehensive monitoring endpoints
- **Monitoring**: Prometheus and Grafana stack for observability
- **Logging**: ELK stack (Elasticsearch, Logstash, Kibana) for log management
- **Infrastructure**: Helm charts for easy deployment to Kubernetes
- **Observability**: Comprehensive metrics, logging, and tracing capabilities

## Features

### Frontend
- React 18 with Vite for fast development
- Material-UI for professional UI components
- React Query for data fetching and state management
- Real-time dashboard with charts using Chart.js
- Responsive design
- Authentication flows (login/logout)
- Service management interface
- Log viewing and filtering
- Settings configuration

### Backend
- Node.js with Express.js
- Comprehensive REST API
- JWT-based authentication
- Rate limiting and security middleware
- MongoDB integration
- Redis for caching
- WebSocket support for real-time updates
- Comprehensive health checks
- Prometheus metrics endpoints
- Structured logging
- Input validation and sanitization
- Error handling and reporting

### Monitoring & Observability
- Prometheus for metrics collection
- Grafana for visualization and dashboards
- Custom application metrics
- System-level metrics (CPU, memory, disk, network)
- Service dependency mapping
- Alerting rules
- Log aggregation with ELK stack

### Infrastructure
- One flat Helm chart for all components
- Resource-optimized for small clusters (2 vCPU, 8GB RAM)
- Gateway API for ingress (compatible with your cluster setup)
- Local storage persistence
- Environment-specific configuration
- Production-ready Docker images

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Frontend      │    │     Backend      │    │   Monitoring     │
│  (React/Vite)   │    │ (Node.js/Express)│    │(Prometheus/Grafana)│
└─────────┬───────┘    └─────────┬────────┘    └─────────┬────────┘
          │                      │                       │
          ▼                      ▼                       ▼
┌───────────────────────────────────────────────────────────────────┐
│                     Kubernetes Cluster                            │
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐  │
│  │Frontend Pod │  │Backend Pod  │  │Prometheus Pod │  │ELK Pods   │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘  │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## Deployment

### Prerequisites
- Kubernetes v1.20+ (tested with v1.30.14)
- Helm v3.0+
- kubectl configured to your cluster
- Container runtime (containerd as in your setup)

### Quick Start

The whole platform is **one flat Helm chart** (`infra/`) - no subcharts and no
external chart repositories are needed.

```bash
# from the repository root
helm upgrade --install devops ./infra -n devops-practice --create-namespace
```

Or use the interactive helper: `./deploy.sh`

After the install, `helm status devops -n devops-practice` prints the URLs
(frontend, API, Kibana, Grafana) built from `gateway.domain` in `values.yaml`.

### Chart layout

```
infra/
├── Chart.yaml
├── values.yaml              # every setting, one section per component
└── templates/
    ├── configmap.yaml       # all non-secret env vars + component configs
    ├── secrets.yaml         # JWT secret (+ Grafana admin password), generated once
    ├── httproutes.yaml      # every external Gateway API route in one place
    ├── frontend.yaml        # Deployment + Service
    ├── backend.yaml         # Deployment + Service
    ├── mongodb.yaml         # PVC + Deployment + Service
    ├── redis.yaml           # Deployment + Service
    ├── elk/                 # logging stack (elk.enabled)
    │   ├── elasticsearch.yaml   # StatefulSet + Service
    │   ├── logstash.yaml        # Deployment + Service (pipeline lives in configmap.yaml)
    │   ├── kibana.yaml          # Deployment + Service
    │   └── filebeat.yaml        # DaemonSet + RBAC, ships container logs to Logstash
    ├── monitoring/          # metrics stack (monitoring.enabled)
    │   ├── prometheus.yaml      # Deployment + RBAC + Service
    │   ├── node-exporter.yaml   # DaemonSet
    │   └── grafana.yaml         # Deployment + Service
    └── NOTES.txt
```

### Customization

Edit `infra/values.yaml`:
- `gateway:` - Gateway name/namespace and the public domain, defined once for all routes
- `<component>.enabled` - switch `mongodb`, `redis`, `elk`, `filebeat`, `monitoring` on/off
- `<component>.route` - subdomain of each externally exposed service
- `backend.env`, `elk.*.env`, `monitoring.grafana.env` - environment variables (stored in ConfigMaps)
- Replica counts, resource requests/limits, image tags

## Development

### Frontend
```bash
cd apps/frontend
npm install
npm run dev
```

### Backend
```bash
cd apps/backend
npm install
npm run dev
```

### Docker Builds
```bash
# Frontend
cd apps/frontend
docker build -t resume-devops/frontend:latest .

# Backend
cd apps/backend
docker build -t resume-devops/backend:latest .
```

## Monitoring Endpoints

The backend exposes several monitoring endpoints:
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed system health
- `GET /api/health/ready` - Kubernetes readiness probe
- `GET /api/health/live` - Kubernetes liveness probe
- `GET /api/metrics` - Prometheus metrics
- `GET /api/services` - Service catalog
- `GET /api/logs` - Log retrieval
- `GET /api/settings` - Configuration management

## Production Considerations

For production deployment, consider:
1. Changing default passwords and secrets
2. Configuring proper TLS termination
3. Setting up persistent storage with proper backup strategies
4. Configuring external authentication providers (LDAP, OAuth)
5. Setting up log retention policies
6. Configuring resource quotas and limits per namespace
7. Setting up backup and disaster recovery procedures
8. Implementing GitOps workflow with ArgoCD or Flux

## Troubleshooting

Common issues and solutions:
- **CrashLoopBackOff**: Check pod logs with `kubectl logs <pod-name>`
- **ImagePullBackOff**: Verify image repository and tags in values.yaml
- **Pending pods**: Check resource availability with `kubectl describe nodes`
- **Service not accessible**: Verify Gateway API configuration and DNS
- **High resource usage**: Adjust resource limits in values.yaml

## License

MIT License - feel free to use this project for learning and portfolio building.

## Author

DevOps Practice Platform - Designed for demonstrating comprehensive DevOps skills suitable for senior positions at companies like Microsoft.
