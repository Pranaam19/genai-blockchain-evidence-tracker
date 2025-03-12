# Blockchain Evidence Tracker

A decentralized application for securely tracking and managing digital evidence using Hyperledger Fabric.

## Prerequisites

- Node.js v18.x
- Docker and Docker Compose
- Python 3.x
- Hyperledger Fabric v2.5.x

## Setup

1. Install dependencies:
```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
cd backend
pip install -r requirements.txt
```

2. Set up Hyperledger Fabric network:
```bash
cd backend/fabric/scripts
chmod +x setup.sh
./setup.sh
```

3. Start the application:
```bash
# Start the frontend
npm run dev

# Start the backend (in a new terminal)
cd backend
python main.py
```

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
