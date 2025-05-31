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

# Create channel
log_message "Creating channel..."
peer channel create -o orderer.example.com:7050 -c mychannel -f /network/channel-artifacts/mychannel.tx --tls --cafile /network/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
check_status "Channel creation"

# Join peer0.org1.example.com to the channel
log_message "Joining peer0.org1.example.com to channel..."
export CORE_PEER_MSPCONFIGPATH=/network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=peer0.org1.example.com:7051
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/network/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
peer channel join -b mychannel.block
check_status "Peer0.org1 joining channel"

# Join peer0.org2.example.com to the channel
log_message "Joining peer0.org2.example.com to channel..."
export CORE_PEER_MSPCONFIGPATH=/network/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=peer0.org2.example.com:9051
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/network/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
peer channel join -b mychannel.block
check_status "Peer0.org2 joining channel"

# Update anchor peers for org1
log_message "Updating anchor peers for org1..."
export CORE_PEER_MSPCONFIGPATH=/network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=peer0.org1.example.com:7051
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/network/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
peer channel update -o orderer.example.com:7050 -c mychannel -f /network/channel-artifacts/Org1MSPanchors.tx --tls --cafile /network/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
check_status "Org1 anchor peer update"

# Update anchor peers for org2
log_message "Updating anchor peers for org2..."
export CORE_PEER_MSPCONFIGPATH=/network/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=peer0.org2.example.com:9051
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/network/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
peer channel update -o orderer.example.com:7050 -c mychannel -f /network/channel-artifacts/Org2MSPanchors.tx --tls --cafile /network/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
check_status "Org2 anchor peer update"

# Install chaincode on peer0.org1.example.com
log_message "Installing chaincode on peer0.org1.example.com..."
export CORE_PEER_MSPCONFIGPATH=/network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=peer0.org1.example.com:7051
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/network/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
peer lifecycle chaincode package evidence.tar.gz --path /chaincode/evidence --lang node --label evidence_1.0
peer lifecycle chaincode install evidence.tar.gz
check_status "Chaincode installation on peer0.org1"

# Install chaincode on peer0.org2.example.com
log_message "Installing chaincode on peer0.org2.example.com..."
export CORE_PEER_MSPCONFIGPATH=/network/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=peer0.org2.example.com:9051
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/network/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
peer lifecycle chaincode install evidence.tar.gz
check_status "Chaincode installation on peer0.org2"

# Get package ID
log_message "Getting package ID..."
export CORE_PEER_MSPCONFIGPATH=/network/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=peer0.org1.example.com:7051
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/network/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
PACKAGE_ID=$(peer lifecycle chaincode queryinstalled | grep evidence_1.0 | awk '{print $3}' | sed 's/,$//')
check_status "Getting package ID"

# Approve chaincode for org1
log_message "Approving chaincode for org1..."
peer lifecycle chaincode approveformyorg -o orderer.example.com:7050 --tls --cafile /network/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --channelID mychannel --name evidence --version 1.0 --package-id $PACKAGE_ID --sequence 1
check_status "Chaincode approval for org1"

# Approve chaincode for org2
log_message "Approving chaincode for org2..."
export CORE_PEER_MSPCONFIGPATH=/network/crypto-config/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
export CORE_PEER_ADDRESS=peer0.org2.example.com:9051
export CORE_PEER_LOCALMSPID="Org2MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=/network/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
peer lifecycle chaincode approveformyorg -o orderer.example.com:7050 --tls --cafile /network/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --channelID mychannel --name evidence --version 1.0 --package-id $PACKAGE_ID --sequence 1
check_status "Chaincode approval for org2"

# Commit chaincode definition
log_message "Committing chaincode definition..."
peer lifecycle chaincode commit -o orderer.example.com:7050 --tls --cafile /network/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem --channelID mychannel --name evidence --version 1.0 --sequence 1 --peerAddresses peer0.org1.example.com:7051 --tlsRootCertFiles /network/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses peer0.org2.example.com:9051 --tlsRootCertFiles /network/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
check_status "Chaincode commitment"

# Initialize the chaincode (if needed)
log_message "Initializing chaincode..."
peer chaincode invoke -o orderer.example.com:7050 --tls --cafile /network/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C mychannel -n evidence --peerAddresses peer0.org1.example.com:7051 --tlsRootCertFiles /network/crypto-config/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses peer0.org2.example.com:9051 --tlsRootCertFiles /network/crypto-config/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{"function":"InitLedger","Args":[]}'
check_status "Chaincode initialization"

log_message "Setup complete! The Fabric network is running and chaincode is deployed."
