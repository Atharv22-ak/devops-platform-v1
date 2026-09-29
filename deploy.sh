#!/bin/bash
# Deployment script for DevOps Practice Platform

set -e  # Exit on any error

echo "=== DevOps Practice Platform Deployment Script ==="
echo

# Check if helm is installed
if ! command -v helm &> /dev/null; then
    echo "Error: helm is not installed. Please install Helm 3.0+"
    exit 1
fi

# Check if kubectl is installed and configured
if ! command -v kubectl &> /dev/null; then
    echo "Error: kubectl is not installed. Please install kubectl"
    exit 1
fi

# Check if we're connected to a cluster
if ! kubectl cluster-info &> /dev/null; then
    echo "Error: Cannot connect to Kubernetes cluster. Please check your kubeconfig"
    exit 1
fi

echo "✓ CLI tools are available and configured"

# Show current context
CURRENT_CONTEXT=$(kubectl config current-context)
echo "✓ Using Kubernetes context: $CURRENT_CONTEXT"

# Ask for release name
read -p "Enter release name (default: devops-platform): " RELEASE_NAME
RELEASE_NAME=${RELEASE_NAME:-devops-platform}

# Ask for namespace
read -p "Enter namespace (default: devops-practice): " NAMESPACE
NAMESPACE=${NAMESPACE:-devops-practice}

# Create namespace if it doesn't exist
if ! kubectl get namespace "$NAMESPACE" &> /dev/null; then
    echo "Creating namespace: $NAMESPACE"
    kubectl create namespace "$NAMESPACE"
    echo "✓ Namespace created"
else
    echo "✓ Namespace $NAMESPACE already exists"
fi

# Ask for values file
echo
echo "Values file options:"
echo "  1. Use default values.yaml"
echo "  2. Specify custom values file"
read -p "Choose option (1 or 2, default: 1): " VALUES_CHOICE

VALUES_FLAG=""
if [ "$VALUES_CHOICE" = "2" ]; then
    read -p "Enter path to custom values file: " CUSTOM_VALUES
    if [ -f "$CUSTOM_VALUES" ]; then
        VALUES_FLAG="-f $CUSTOM_VALUES"
        echo "✓ Using custom values file: $CUSTOM_VALUES"
    else
        echo "Error: File $CUSTOM_VALUES not found"
        exit 1
    fi
else
    echo "✓ Using default values.yaml"
fi

# Confirm installation
echo
echo "=== Deployment Summary ==="
echo "Release name: $RELEASE_NAME"
echo "Namespace: $NAMESPACE"
echo "Values: $VALUES_FLAG"
echo
read -p "Proceed with installation? (y/N): " CONFIRM

if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
    echo "Installation cancelled."
    exit 0
fi

# Install the platform
echo
echo "=== Installing DevOps Practice Platform ==="
helm upgrade --install "$RELEASE_NAME" ./infra/ $VALUES_FLAG --namespace "$NAMESPACE" --create-namespace

echo
echo "=== Installation Complete ==="
echo "Release: $RELEASE_NAME"
echo "Namespace: $NAMESPACE"
echo
echo "To check the status:"
echo "  helm status $RELEASE_NAME --namespace $NAMESPACE"
echo
echo "To get detailed information:"
echo "  helm get all $RELEASE_NAME --namespace $NAMESPACE"
echo
echo "URLs and Grafana/Kibana instructions are printed in the release notes:"
echo "  helm status $RELEASE_NAME --namespace $NAMESPACE"
echo
echo "To uninstall:"
echo "  helm uninstall $RELEASE_NAME --namespace $NAMESPACE"
echo
echo "Happy DevOps practicing! 🚀"
