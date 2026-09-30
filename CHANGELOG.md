# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- Login / sign-up page; every page except `/login` now requires a signed-in user
- Users are stored in MongoDB (they survive pod restarts); first admin is seeded from `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- Admin-only Users page (list, add, delete) and JWT protection on `/api/services|monitoring|logs|settings`
- New sidebar layout and refreshed theme

### Fixed
- Frontend CrashLoopBackOff: nginx upstream came from a stale image; `envsubst` now only substitutes `BACKEND_HOST` / `BACKEND_PORT`
- Rate limit now read from `RATE_LIMIT_MAX` (was hard-coded to 100) and failed logins are limited per IP + email

- Initial release of DevOps Practice Platform
- Comprehensive frontend with React/Vite and Material-UI
- Backend API with Node.js/Express and MongoDB
- Monitoring stack with Prometheus and Grafana
- Logging stack with ELK (Elasticsearch, Logstash, Kibana)
- Helm charts for all components
- Gateway API integration for ingress
- Docker images for frontend and backend
- Comprehensive documentation

## [1.1.0] - 2026-09-28
### Changed
- Replaced the umbrella chart + subcharts with a single flat chart: one template file per component under `infra/templates/`
- Gateway name/namespace/domain defined once in `values.yaml`; all routes live in `templates/httproutes.yaml`
- Non-secret environment variables moved into ConfigMaps (`templates/configmap.yaml`)
- Monitoring now uses plain Prometheus, node-exporter and Grafana templates instead of the kube-prometheus-stack dependency

### Added
- Filebeat DaemonSet shipping container logs to Logstash
- Add User / Sign out in the header menu, `POST /api/auth/register` endpoint

### Removed
- Docker Compose setup, root-level `monitoring/` configs and other unused files

## [1.0.0] - 2026-09-27
### Added
- Initial project structure
- Frontend application with dashboard, service management, logs, and settings
- Backend API with authentication, monitoring, and CRUD operations
- Helm charts for frontend, backend, monitoring, and ELK stack
- Dockerfiles for both frontend and backend
- Docker-compose for local development
- Monitoring configurations (Prometheus, Grafana, Alerts)
- ELK stack configurations
- Comprehensive README with deployment instructions
- Resource-optimized configurations for small Kubernetes clusters

### Changed
- N/A (initial release)

### Deprecated
- N/A

### Removed
- N/A

### Fixed
- N/A

### Security
- N/A
