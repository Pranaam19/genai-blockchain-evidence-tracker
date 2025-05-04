"use client"; 
import { useState, useRef } from 'react';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [uploadResult, setUploadResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      setIsUploading(true);
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
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-blue-900 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Secure Evidence Upload</h2>
          <p className="text-blue-200 text-sm mt-1">
            Files are verified with AI, encrypted, and stored on blockchain
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Evidence File
            </label>
            
            <div 
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              } ${file ? "bg-green-50 border-green-300" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input 
                ref={inputRef}
                type="file" 
                onChange={handleFileChange}
                className="hidden"
              />
              
              {file ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-xs text-red-600 hover:text-red-800 font-medium"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">Drag and drop your file here, or</p>
                    <button
                      type="button"
                      onClick={onButtonClick}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      click to browse
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Supports images, documents, audio, and video files
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {file && (
                <span>File ready for secure upload and verification</span>
              )}
            </div>
            <button
              type="submit"
              disabled={!file || isUploading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                ${!file || isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}
                transition-colors duration-200 ease-in-out flex items-center`}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload & Verify
                </>
              )}
            </button>
          </div>
        </form>
        
        {status && (
          <div className={`mx-6 mb-6 p-4 rounded-md ${
            status.includes('success') ? 'bg-green-50 text-green-800' : 
            status.includes('failed') || status.includes('Error') ? 'bg-red-50 text-red-800' : 
            'bg-blue-50 text-blue-800'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {status.includes('success') ? (
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : status.includes('failed') || status.includes('Error') ? (
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{status}</p>
              </div>
            </div>
          </div>
        )}
        
        {uploadResult && (
          <div className="border-t border-gray-200 px-6 py-5">
            <h3 className="text-lg font-medium text-gray-900">Evidence Details</h3>
            
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">File Information</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Filename:</span>
                      <span className="text-sm font-medium text-gray-900">{uploadResult.metadata.filename}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Size:</span>
                      <span className="text-sm font-medium text-gray-900">{Math.round(uploadResult.metadata.size / 1024)} KB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Type:</span>
                      <span className="text-sm font-medium text-gray-900">{uploadResult.metadata.content_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Timestamp:</span>
                      <span className="text-sm font-medium text-gray-900">{new Date(uploadResult.metadata.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Blockchain Information</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Hash:</span>
                      <span className="text-sm font-mono text-gray-900">{uploadResult.hash.substring(0, 8)}...{uploadResult.hash.substring(uploadResult.hash.length - 8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Blockchain Status:</span>
                      <span className={`text-sm font-medium ${uploadResult.blockchain_stored ? 'text-green-600' : 'text-yellow-600'}`}>
                        {uploadResult.blockchain_stored ? 'Stored on blockchain' : 'Stored locally only'}
                      </span>
                    </div>
                    {uploadResult.txid && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Transaction ID:</span>
                        <span className="text-sm font-mono text-gray-900">{uploadResult.txid}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* AI Verification Results */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500">AI Verification Results</h4>
                <div className="mt-2 p-3 rounded-md bg-white border border-gray-200">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 rounded-full p-1 ${uploadResult.verification.verified ? 'bg-green-100' : 'bg-red-100'}`}>
                      {uploadResult.verification.verified ? (
                        <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-3">
                      <h5 className={`text-sm font-medium ${uploadResult.verification.verified ? 'text-green-800' : 'text-red-800'}`}>
                        {uploadResult.verification.verified ? 'Evidence Verified Authentic' : 'Potential Manipulation Detected'}
                      </h5>
                      {uploadResult.verification.confidence && (
                        <p className="text-xs text-gray-500 mt-1">
                          Confidence: {Math.round(uploadResult.verification.confidence * 100)}%
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {uploadResult.verification.details && uploadResult.verification.details.top_predictions && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <h6 className="text-xs font-medium text-gray-500">Analysis Details:</h6>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {uploadResult.verification.details.top_predictions.map((pred, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">{pred.class}:</span>
                            <div className="w-24 bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${idx === 0 ? 'bg-blue-600' : 'bg-gray-400'}`}
                                style={{ width: `${Math.round(pred.score * 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-900">{Math.round(pred.score * 100)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Storage Information */}
              {uploadResult.storage && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500">Storage Information</h4>
                  <div className="mt-2 p-3 rounded-md bg-white border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          <span className="ml-2 text-sm text-gray-700">
                            {uploadResult.storage.distributed ? 'Distributed (IPFS)' : 'Local Storage'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center">
                          <svg className="h-5 w-5 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          <span className="ml-2 text-sm text-gray-700">
                            {uploadResult.storage.encrypted ? 'Encrypted' : 'Unencrypted'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {uploadResult.storage.ipfs_hash && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center">
                          <span className="text-xs text-gray-500">IPFS Hash:</span>
                          <span className="ml-2 text-xs font-mono bg-gray-100 p-1 rounded">{uploadResult.storage.ipfs_hash}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Download Button */}
              <div className="mt-6 flex justify-end">
                <a 
                  href={`http://localhost:8001/evidence/${uploadResult.hash}/download`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Evidence
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
