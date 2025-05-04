#!/bin/bash

# Navigate to fabric-samples directory
cd fabric-samples/test-network

# Bring down any previous network
./network.sh down

# Start network with CA and create channel
./network.sh up createChannel -c mychannel -ca

# Deploy the chaincode
./network.sh deployCC -ccn evidence -ccp ../../fabric/chaincode/evidence -ccl javascript

# Copy the connection profile
cp organizations/peerOrganizations/org1.example.com/connection-org1.yaml ../../fabric/network/ 