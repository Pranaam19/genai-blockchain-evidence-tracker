FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY backend/ .

# Create necessary directories
RUN mkdir -p uploads simulated_ipfs encryption_keys

# Expose the port
EXPOSE 8001

# Start the application
CMD ["python", "main.py"]
