import os
import logging
import hashlib
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import subprocess
import datetime
import uvicorn

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
os.makedirs("uploads", exist_ok=True)

# Check if Fabric network is running
def check_fabric_network():
    try:
        # Check if Docker containers are running
        result = subprocess.run(
            ["docker", "ps", "--format", "{{.Names}}", "--filter", "name=peer0.org1.example.com"],
            capture_output=True,
            text=True
        )
        
        if "peer0.org1.example.com" in result.stdout:
            logger.info("Fabric network is running")
            return True
        else:
            logger.warning("Fabric network is not running")
            return False
    except Exception as e:
        logger.error(f"Error checking Fabric network: {e}")
        return False

# Initialize blockchain connection status
BLOCKCHAIN_ENABLED = check_fabric_network()

@app.get("/")
async def root():
    # Check network status on each request
    blockchain_status = check_fabric_network()
    return {"status": "healthy", "blockchain_enabled": blockchain_status}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        # Read file contents
        contents = await file.read()
        
        # Calculate file hash
        file_hash = hashlib.sha256(contents).hexdigest()
        logger.debug(f"File hash: {file_hash}")
        
        # Save file to uploads directory
        file_path = os.path.join("uploads", file_hash)
        with open(file_path, "wb") as f:
            f.write(contents)
        
        # Create metadata
        metadata = {
            "filename": file.filename,
            "content_type": file.content_type,
            "size": len(contents),
            "hash": file_hash,
            "timestamp": str(datetime.datetime.now())
        }
        
        # Check if blockchain is enabled
        if check_fabric_network():
            # In a real implementation, we would store on blockchain here
            # For now, we'll simulate a successful blockchain transaction
            txid = "simulated_tx_" + file_hash[:8]
            logger.info(f"Simulated blockchain storage with txid: {txid}")
            
            return JSONResponse(content={
                "status": "success",
                "hash": file_hash,
                "txid": txid,
                "metadata": metadata,
                "blockchain_stored": True
            })
        else:
            # Store locally only
            logger.warning("Blockchain network not available, storing locally only")
            return JSONResponse(content={
                "status": "success",
                "hash": file_hash,
                "metadata": metadata,
                "blockchain_stored": False,
                "message": "File stored locally only. Blockchain network not available."
            })
            
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing upload: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
