# Contributing to DevOps Practice Platform

Thank you for considering contributing to the DevOps Practice Platform! This document outlines the process for contributing to this project.

## How to Contribute

### Reporting Bugs
Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible.

### Suggesting Features
If you have an idea for a new feature, please open an issue first to discuss it.

### Code Contributions
1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes
4. Ensure your code follows the project's coding standards
5. Add tests for your changes
6. Run the tests to ensure they pass
7. Commit your changes
8. Push to your branch
9. Create a new Pull Request

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Docker
- Kubernetes cluster (for Helm chart testing)
- Helm 3.0+

### Frontend Development
```bash
cd apps/frontend
npm install
npm run dev
```

### Backend Development
```bash
cd apps/backend
npm install
npm run dev
```

### Testing
```bash
# Frontend tests
cd apps/frontend
npm test

# Backend tests
cd apps/backend
npm test
```

### Building Docker Images
```bash
# Frontend
cd apps/frontend
docker build -t resume-devops/frontend:latest .

# Backend
cd apps/backend
docker build -t resume-devops/backend:latest .
```

### Testing Helm Charts
```bash
# Lint charts
helm lint infra/charts/frontend
helm lint infra/charts/backend
helm lint infra/charts/monitoring
helm lint infra/charts/elk
helm lint infra/

# Dry run installation
helm install --dry-run --debug devops-platform ./infra/
```

## Coding Standards

### JavaScript/TypeScript
- Follow Airbnb JavaScript Style Guide
- Use ESLint for linting
- Use Prettier for code formatting
- Write meaningful commit messages

### Helm Charts
- Follow Helm chart best practices
- Use named templates for reusable code
- Provide sensible defaults in values.yaml
- Document all configurable values
- Include NOTES.txt with useful information

### Documentation
- Keep README.md up to date
- Update CHANGELOG.md for notable changes
- Document all new features and configuration options
- Use clear, concise language

## Pull Request Process

1. Ensure your code passes all tests
2. Update documentation as needed
3. Ensure your commit messages are clear and descriptive
4. Keep your pull request focused on a single feature or bug fix
5. Engage in discussion if reviewers request changes
6. Once approved, your PR will be merged

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.

## Getting Help

If you need help with your contribution, please:
1. Check the existing documentation
2. Look at similar implementations in the codebase
3. Ask for clarification in the issue tracker

Thank you again for contributing to the DevOps Practice Platform!
