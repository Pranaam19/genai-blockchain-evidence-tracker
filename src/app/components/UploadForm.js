"use client"; 
import { useState } from 'react';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [uploadResult, setUploadResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      setStatus('Uploading and verifying...');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8001/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(`File uploaded successfully!`);
        setUploadResult(data);
      } else {
        setStatus(`Upload failed: ${data.detail || 'Unknown error'}`);
        setUploadResult(null);
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
      console.error('Upload error:', error);
      setUploadResult(null);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Select Evidence File
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>
        <button
          type="submit"
          disabled={!file}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          Upload Evidence
        </button>
      </form>
      {status && (
        <div className="mt-4 p-4 rounded-md bg-gray-50">
          <p className="text-sm text-gray-800">{status}</p>
        </div>
      )}
      
      {uploadResult && (
        <div className="mt-4 p-4 rounded-md bg-blue-50">
          <h3 className="font-medium text-blue-900">Upload Details:</h3>
          <div className="mt-2 text-sm text-blue-800">
            <p><span className="font-semibold">File Hash:</span> {uploadResult.hash}</p>
            <p><span className="font-semibold">File Name:</span> {uploadResult.metadata.filename}</p>
            <p><span className="font-semibold">Size:</span> {Math.round(uploadResult.metadata.size / 1024)} KB</p>
            <p><span className="font-semibold">Timestamp:</span> {uploadResult.metadata.timestamp}</p>
            <p><span className="font-semibold">Blockchain Status:</span> {uploadResult.blockchain_stored ? 'Stored on blockchain' : 'Stored locally only'}</p>
            {uploadResult.txid && (
              <p><span className="font-semibold">Transaction ID:</span> {uploadResult.txid}</p>
            )}
            
            {/* Verification Results */}
            <div className="mt-3 border-t border-blue-200 pt-3">
              <h4 className="font-semibold">AI Verification:</h4>
              <div className="mt-1">
                <p className={`font-medium ${uploadResult.verification.verified ? 'text-green-600' : 'text-red-600'}`}>
                  {uploadResult.verification.verified ? '✅ Verified Authentic' : '❌ Potential Manipulation Detected'}
                </p>
                {uploadResult.verification.confidence && (
                  <p>Confidence: {Math.round(uploadResult.verification.confidence * 100)}%</p>
                )}
                {uploadResult.verification.error && (
                  <p className="text-red-600">Error: {uploadResult.verification.error}</p>
                )}
                {uploadResult.verification.details && uploadResult.verification.details.top_predictions && (
                  <div className="mt-2">
                    <p className="font-medium">Analysis Details:</p>
                    <ul className="list-disc pl-5 mt-1">
                      {uploadResult.verification.details.top_predictions.map((pred, idx) => (
                        <li key={idx}>{pred.class}: {Math.round(pred.score * 100)}%</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            {/* Storage Information */}
            {uploadResult.storage && (
              <div className="mt-3 border-t border-blue-200 pt-3">
                <h4 className="font-semibold">Storage Information:</h4>
                <div className="mt-1">
                  <p>
                    <span className="font-medium">Storage Type:</span> {uploadResult.storage.distributed ? 'Distributed (IPFS)' : 'Local'}
                  </p>
                  <p>
                    <span className="font-medium">Encryption:</span> {uploadResult.storage.encrypted ? 'Encrypted' : 'Unencrypted'}
                  </p>
                  {uploadResult.storage.ipfs_hash && (
                    <p>
                      <span className="font-medium">IPFS Hash:</span> {uploadResult.storage.ipfs_hash}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            {/* Download Link */}
            <div className="mt-4">
              <a 
                href={`http://localhost:8001/evidence/${uploadResult.hash}/download`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download Evidence
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
