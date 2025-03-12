import os
import logging
import hashlib
import datetime
import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import subprocess
from ai_verification import verify_evidence
from storage import store_evidence, retrieve_evidence

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

# Create directories
os.makedirs("uploads", exist_ok=True)
os.makedirs("simulated_ipfs", exist_ok=True)
os.makedirs("encryption_keys", exist_ok=True)

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
        
        # Save file to uploads directory (temporary)
        file_path = os.path.join("uploads", file_hash)
        with open(file_path, "wb") as f:
            f.write(contents)
        
        # Verify the evidence using AI
        verification_result = verify_evidence(file_path, file.content_type)
        
        # Store in decentralized storage with encryption
        storage_result = store_evidence(contents, file_hash)
        
        # Create metadata
        metadata = {
            "filename": file.filename,
            "content_type": file.content_type,
            "size": len(contents),
            "hash": file_hash,
            "timestamp": str(datetime.datetime.now()),
            "verification": verification_result,
            "storage": {
                "encrypted": True,
                "ipfs_hash": storage_result["ipfs_hash"] if storage_result else None,
                "distributed": True
            }
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
                "blockchain_stored": True,
                "verification": verification_result,
                "storage": storage_result
            })
        else:
            # Store locally only
            logger.warning("Blockchain network not available, storing locally only")
            return JSONResponse(content={
                "status": "success",
                "hash": file_hash,
                "metadata": metadata,
                "blockchain_stored": False,
                "verification": verification_result,
                "storage": storage_result,
                "message": "File stored locally only. Blockchain network not available."
            })
            
    except Exception as e:
        logger.error(f"Upload error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing upload: {str(e)}")

@app.get("/evidence")
async def list_evidence():
    try:
        # List files in uploads directory
        files = os.listdir("uploads")
        evidence_list = []
        
        for file_hash in files:
            # Read metadata from a metadata file or create basic info
            evidence_list.append({
                "hash": file_hash,
                "timestamp": datetime.datetime.fromtimestamp(
                    os.path.getctime(os.path.join("uploads", file_hash))
                ).isoformat()
            })
            
        return {"evidence": evidence_list}
    except Exception as e:
        logger.error(f"Error listing evidence: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error listing evidence: {str(e)}")

@app.get("/evidence/{evidence_hash}")
async def get_evidence(evidence_hash: str):
    try:
        file_path = os.path.join("uploads", evidence_hash)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Evidence not found")
            
        # Get file info
        file_stats = os.stat(file_path)
        
        # In a real implementation, we would fetch this from blockchain
        return {
            "hash": evidence_hash,
            "size": file_stats.st_size,
            "created": datetime.datetime.fromtimestamp(file_stats.st_ctime).isoformat(),
            "blockchain_status": "Simulated blockchain record",
            "ipfs_hash": f"ipfs-{evidence_hash[:16]}"  # Simulated IPFS hash
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving evidence: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving evidence: {str(e)}")

@app.get("/evidence/{evidence_hash}/download")
async def download_evidence(evidence_hash: str):
    try:
        # Retrieve from storage
        file_data = retrieve_evidence(evidence_hash)
        if not file_data:
            raise HTTPException(status_code=404, detail="Evidence not found or could not be decrypted")
        
        # Get original filename from metadata (in a real implementation)
        # For now, we'll use the hash as the filename
        filename = f"evidence_{evidence_hash[:8]}.bin"
        
        return Response(
            content=file_data,
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        logger.error(f"Error downloading evidence: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error downloading evidence: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
