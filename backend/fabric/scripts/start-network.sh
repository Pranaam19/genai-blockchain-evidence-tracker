#!/bin/bash

# Get the absolute path to the chaincode directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CHAINCODE_DIR="${SCRIPT_DIR}/../chaincode/evidence"
NETWORK_DIR="${SCRIPT_DIR}/../network"

# Ensure the network directory exists
mkdir -p "${NETWORK_DIR}"

# Navigate to fabric-samples directory
cd fabric-samples/test-network

# Bring down any previous network
./network.sh down

# Start network with CA and create channel
./network.sh up createChannel -c mychannel -ca

# Deploy the chaincode
./network.sh deployCC -ccn evidence -ccp "${CHAINCODE_DIR}" -ccl javascript

# Copy the connection profile
cp organizations/peerOrganizations/org1.example.com/connection-org1.yaml "${NETWORK_DIR}/" 