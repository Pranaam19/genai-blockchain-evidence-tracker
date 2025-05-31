# Blockchain Evidence Tracker

A decentralized application for securely tracking and managing digital evidence using Hyperledger Fabric.

## Prerequisites

### For Docker Setup (Recommended)
- Docker and Docker Compose

### For Manual Setup
- Node.js v18.x
- Docker and Docker Compose
- Python 3.x
- Hyperledger Fabric v2.5.x

## Setup

### Option 1: Docker Compose Setup (Recommended)

This is the easiest way to set up the entire project with a single command.

1. Clone the repository:
```bash
git clone https://github.com/Pranaam19/genai-blockchain-evidence-tracker.git
cd genai-blockchain-evidence-tracker
```

2. Create a `.env` file in the root directory (optional):
```bash
# Frontend environment variables
NEXT_PUBLIC_API_URL=http://localhost:8001

# Backend environment variables
FABRIC_NETWORK_PATH=/app/fabric/network
```

3. Start the application using Docker Compose:
```bash
docker-compose up
```

This will build and start all the necessary services:
- Frontend application (accessible at http://localhost:3000)
- Backend API server (accessible at http://localhost:8001)
- Hyperledger Fabric network with all required components

The first run may take some time as it needs to:
- Build Docker images for the frontend and backend
- Download Hyperledger Fabric images
- Set up the blockchain network
- Deploy and initialize the chaincode

To stop the application, press Ctrl+C in the terminal or run:
```bash
docker-compose down
```

To completely remove all containers, networks, and volumes:
```bash
docker-compose down -v
```

#### Troubleshooting Docker Setup

If you encounter any issues with the Docker setup:

1. Check Docker logs:
```bash
docker-compose logs
```

2. Check logs for a specific service:
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs setup
```

3. Ensure Docker has enough resources allocated (memory, CPU)

4. If the Fabric network setup fails, you can try rebuilding just the setup service:
```bash
docker-compose up -d --build setup
```

### Option 2: Manual Setup

#### 1. Clone the repository
```bash
git clone https://github.com/Pranaam19/genai-blockchain-evidence-tracker.git
cd genai-blockchain-evidence-tracker
```

#### 2. Install dependencies

```bash
# Install Node.js dependencies
npm install

# Set up Python virtual environment and install dependencies
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

#### 3. Set up Hyperledger Fabric network

Make sure Docker is running before proceeding with this step.

```bash
# Ensure the network directory exists
mkdir -p backend/fabric/network

# Make the start-network script executable
chmod +x backend/fabric/scripts/start-network.sh

# Start the Hyperledger Fabric network
cd backend/fabric/scripts
./start-network.sh
cd ../../..
```

**Note:** If you encounter issues with the setup script, you might need to modify the `start-network.sh` script to use absolute paths. The script should look like this:

```bash
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
```

#### 4. Start the application

```bash
# Start the frontend (in one terminal)
npm run dev

# Start the backend (in another terminal)
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```

## Environment Variables

The application uses the following environment variables:

### For Docker Setup

Environment variables are already configured in the docker-compose.yml file. However, you can override them by creating a `.env` file in the root directory with the following content:

```
# Frontend environment variables
NEXT_PUBLIC_API_URL=http://localhost:8001

# Backend environment variables
FABRIC_NETWORK_PATH=/app/fabric/network
```

### For Manual Setup

For the manual setup, you'll need to set these environment variables:

1. Frontend (Next.js):
   - `NEXT_PUBLIC_API_URL`: URL of the backend API (default: http://localhost:8001)

2. Backend (Python):
   - `FABRIC_NETWORK_PATH`: Path to the Fabric network configuration files

## Testing the Application

1. After starting the application (either with Docker or manually), open your browser and navigate to http://localhost:3000

2. You should see the Blockchain Evidence Tracker interface

3. You can:
   - Upload new evidence files
   - View existing evidence records
   - Verify evidence integrity
   - Search for specific evidence records

4. The backend API is available at http://localhost:8001 with the following endpoints:
   - `/api/evidence`: Upload and retrieve evidence
   - `/api/evidence/{id}`: Get specific evidence details
   - `/api/verify/{id}`: Verify evidence integrity

## Project Structure

```
genai-blockchain-evidence-tracker/
├── backend/
│   ├── fabric/
│   │   ├── chaincode/     # Fabric chaincode
│   │   ├── network/       # Network configuration
│   │   └── scripts/       # Setup and utility scripts
│   ├── main.py           # Backend API server
│   └── requirements.txt  # Python dependencies
├── src/                  # Frontend React components
├── docker-compose.yml    # Docker Compose configuration
├── frontend.Dockerfile   # Frontend Docker configuration
├── backend.Dockerfile    # Backend Docker configuration
└── package.json
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
