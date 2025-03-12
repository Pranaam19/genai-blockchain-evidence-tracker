#!/bin/bash

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Function to check command status
check_status() {
    if [ $? -eq 0 ]; then
        log_message "✅ $1 successful"
    else
        log_message "❌ Error: $1 failed"
        exit 1
    fi
}

# Function to verify Docker installation
verify_docker() {
    log_message "Verifying Docker installation..."
    
    # Stop Docker service
    sudo systemctl stop docker
    
    # Fix permissions
    sudo usermod -aG docker $USER
    sudo chmod 666 /var/run/docker.sock
    
    # Start Docker service
    sudo systemctl start docker
    sudo systemctl enable docker
    
    # Wait for Docker to be ready
    sleep 5
    
    # Check if Docker service is running
    if ! sudo systemctl is-active --quiet docker; then
        log_message "Starting Docker service..."
        sudo systemctl start docker
        sudo systemctl enable docker
    fi
    
    # Verify Docker is running
    if ! docker info >/dev/null 2>&1; then
        log_message "❌ Error: Docker is not running. Attempting to fix..."
        sudo systemctl restart docker
        sleep 5
        if ! docker info >/dev/null 2>&1; then
            log_message "❌ Error: Could not start Docker. Please check Docker installation."
            exit 1
        fi
    fi
    
    log_message "✅ Docker is running properly"
}

# Install prerequisites
log_message "Installing prerequisites..."
sudo apt update
sudo apt install -y curl docker.io docker-compose git python3-pip
check_status "Prerequisites installation"

# Verify Docker
verify_docker

# Install Node.js
log_message "Installing Node.js..."
# Remove existing Node.js installations first
sudo apt-get remove --purge -y nodejs npm libnode-dev libnode72
sudo apt-get autoremove -y
sudo apt-get clean

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
check_status "Node.js installation"

# Verify Node.js installation
node_version=$(node --version)
log_message "Node.js version: $node_version"

# Add user to docker group
log_message "Configuring Docker permissions..."
sudo usermod -aG docker $USER
newgrp docker
check_status "Docker group configuration"

# Install Python dependencies
log_message "Installing Python dependencies..."
pip3 install fabric-sdk-py
check_status "Python dependencies installation"

# Create directory for Fabric
FABRIC_ROOT=$HOME/fabric
mkdir -p $FABRIC_ROOT
cd $FABRIC_ROOT
check_status "Directory creation"

# Download Fabric binaries and docker images
log_message "Downloading Fabric binaries and docker images..."
curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.5.0
check_status "Fabric download"

# Add Fabric binaries to PATH
export PATH=$PATH:$FABRIC_ROOT/fabric-samples/bin
export FABRIC_CFG_PATH=$FABRIC_ROOT/fabric-samples/config

# Clone fabric-samples if not already done
if [ ! -d "fabric-samples" ]; then
    log_message "Cloning fabric-samples..."
    git clone https://github.com/hyperledger/fabric-samples.git
    check_status "fabric-samples clone"
fi

# Create directories for our chaincode
log_message "Setting up chaincode..."
mkdir -p fabric-samples/chaincode/evidence
BACKEND_ROOT=$(cd "$(dirname "$0")/../../" && pwd)

# Copy our chaincode
cp -r $BACKEND_ROOT/fabric/chaincode/evidence/* $FABRIC_ROOT/fabric-samples/chaincode/evidence/
check_status "Chaincode copy"

# Start the test network
log_message "Starting test network..."
cd $FABRIC_ROOT/fabric-samples/test-network
./network.sh down # Clean up any previous network
./network.sh up createChannel -c mychannel -ca
check_status "Network startup"

# Install chaincode dependencies
log_message "Installing chaincode dependencies..."
cd ../chaincode/evidence
npm install
check_status "Chaincode dependencies installation"

# Package and deploy chaincode
log_message "Deploying chaincode..."
cd ../../test-network
peer lifecycle chaincode package evidence.tar.gz --path ../chaincode/evidence --lang node --label evidence_1.0
./network.sh deployCC -ccn evidence -ccp ../chaincode/evidence -ccl node
check_status "Chaincode deployment"

log_message "Setup complete! The Fabric network is running and chaincode is deployed."

# Save environment variables for future use
echo "export PATH=$PATH:$FABRIC_ROOT/fabric-samples/bin" >> ~/.bashrc
echo "export FABRIC_CFG_PATH=$FABRIC_ROOT/fabric-samples/config" >> ~/.bashrc

# Final verification
log_message "Verifying installation..."
docker ps
peer version
node --version 