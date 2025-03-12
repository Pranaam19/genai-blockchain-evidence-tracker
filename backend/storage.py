import os
import logging
import hashlib
import base64
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC

# Configure logging
logger = logging.getLogger(__name__)

# Create directory for encryption keys
os.makedirs("encryption_keys", exist_ok=True)

def generate_encryption_key(file_hash):
    """Generate a deterministic encryption key based on file hash"""
    try:
        # Use file hash as a seed for the encryption key
        salt = b'verichain_salt'  # In production, use a secure random salt
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,
            salt=salt,
            iterations=100000,
        )
        key = base64.urlsafe_b64encode(kdf.derive(file_hash.encode()))
        
        # Save key to file for future use
        key_path = os.path.join("encryption_keys", file_hash)
        with open(key_path, "wb") as f:
            f.write(key)
            
        return key
    except Exception as e:
        logger.error(f"Error generating encryption key: {e}")
        return None

def get_encryption_key(file_hash):
    """Get encryption key for a file"""
    key_path = os.path.join("encryption_keys", file_hash)
    if os.path.exists(key_path):
        with open(key_path, "rb") as f:
            return f.read()
    else:
        return generate_encryption_key(file_hash)

def encrypt_file(file_data, file_hash):
    """Encrypt file data using Fernet symmetric encryption"""
    try:
        key = get_encryption_key(file_hash)
        if not key:
            raise ValueError("Failed to get encryption key")
            
        cipher = Fernet(key)
        encrypted_data = cipher.encrypt(file_data)
        return encrypted_data
    except Exception as e:
        logger.error(f"Error encrypting file: {e}")
        return None

def decrypt_file(encrypted_data, file_hash):
    """Decrypt file data"""
    try:
        key = get_encryption_key(file_hash)
        if not key:
            raise ValueError("Failed to get encryption key")
            
        cipher = Fernet(key)
        decrypted_data = cipher.decrypt(encrypted_data)
        return decrypted_data
    except Exception as e:
        logger.error(f"Error decrypting file: {e}")
        return None

def simulate_ipfs_store(encrypted_data, file_hash):
    """
    Simulate IPFS storage by storing encrypted data locally
    In a real implementation, this would use ipfshttpclient to store on IPFS
    """
    try:
        # Create directory for simulated IPFS storage
        ipfs_dir = "simulated_ipfs"
        os.makedirs(ipfs_dir, exist_ok=True)
        
        # Store encrypted data
        ipfs_path = os.path.join(ipfs_dir, file_hash)
        with open(ipfs_path, "wb") as f:
            f.write(encrypted_data)
            
        # Return simulated IPFS hash (in real IPFS, this would be a CID)
        simulated_ipfs_hash = f"ipfs-{hashlib.sha256(encrypted_data).hexdigest()[:16]}"
        return simulated_ipfs_hash
    except Exception as e:
        logger.error(f"Error storing in simulated IPFS: {e}")
        return None

def simulate_ipfs_retrieve(ipfs_hash, file_hash):
    """
    Simulate retrieving data from IPFS
    In a real implementation, this would use ipfshttpclient to retrieve from IPFS
    """
    try:
        # In our simulation, we ignore the ipfs_hash and use file_hash directly
        ipfs_path = os.path.join("simulated_ipfs", file_hash)
        if not os.path.exists(ipfs_path):
            raise FileNotFoundError(f"File not found in simulated IPFS: {file_hash}")
            
        with open(ipfs_path, "rb") as f:
            encrypted_data = f.read()
            
        # Decrypt the data
        decrypted_data = decrypt_file(encrypted_data, file_hash)
        if not decrypted_data:
            raise ValueError("Failed to decrypt data")
            
        return decrypted_data
    except Exception as e:
        logger.error(f"Error retrieving from simulated IPFS: {e}")
        return None

def store_evidence(file_data, file_hash):
    """Store evidence with encryption and IPFS simulation"""
    try:
        # Encrypt the file
        encrypted_data = encrypt_file(file_data, file_hash)
        if not encrypted_data:
            raise ValueError("Failed to encrypt file")
            
        # Store in simulated IPFS
        ipfs_hash = simulate_ipfs_store(encrypted_data, file_hash)
        if not ipfs_hash:
            raise ValueError("Failed to store in IPFS")
            
        return {
            "file_hash": file_hash,
            "ipfs_hash": ipfs_hash,
            "encrypted": True,
            "size": len(encrypted_data)
        }
    except Exception as e:
        logger.error(f"Error storing evidence: {e}")
        return None

def retrieve_evidence(file_hash, ipfs_hash=None):
    """Retrieve evidence from storage"""
    try:
        # Retrieve from simulated IPFS
        decrypted_data = simulate_ipfs_retrieve(ipfs_hash, file_hash)
        if not decrypted_data:
            raise ValueError("Failed to retrieve from IPFS")
            
        return decrypted_data
    except Exception as e:
        logger.error(f"Error retrieving evidence: {e}")
        return None 