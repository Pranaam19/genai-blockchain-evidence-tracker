"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EvidenceDetailPage({ params }) {
  const { hash } = params;
  const [evidence, setEvidence] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real application, we would fetch the evidence details from the API
    // For now, we'll create a mock evidence object
    const fetchEvidenceDetails = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Create mock evidence details
        const mockEvidence = {
          hash: hash,
          filename: `evidence_${hash.substring(0, 8)}.pdf`,
          content_type: "application/pdf",
          size: 1024 * 1024 * Math.floor(Math.random() * 10 + 1), // Random size between 1-10 MB
          timestamp: new Date().toISOString(),
          blockchain_stored: true,
          txid: `tx_${Math.random().toString(36).substring(2, 10)}`,
          verification: {
            authentic: true,
            confidence: 0.95,
            analysis: "File signature matches expected format. No signs of tampering detected."
          }
        };
        
        setEvidence(mockEvidence);
        setError(null);
      } catch (err) {
        console.error('Error fetching evidence details:', err);
        setError('Failed to load evidence details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvidenceDetails();
  }, [hash]);

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Evidence Details</h1>
          <Link href="/evidence" className="text-blue-600 hover:text-blue-800">
            Back to Evidence Vault
          </Link>
        </div>

        {isLoading ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-500">Loading evidence details...</p>
          </div>
        ) : error ? (
          <div className="bg-white shadow rounded-lg p-8">
            <div className="rounded-md bg-red-50 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Link href="/evidence" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                Return to Evidence Vault
              </Link>
            </div>
          </div>
        ) : evidence ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-blue-700 text-white">
              <h2 className="text-xl font-semibold">Evidence Information</h2>
              <p className="mt-1 text-sm text-blue-100">
                Complete details and verification status
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">File Hash</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono">
                    {evidence.hash}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Filename</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {evidence.filename}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Content Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {evidence.content_type}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">File Size</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {formatBytes(evidence.size)}
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Timestamp</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {new Date(evidence.timestamp).toLocaleString()}
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Blockchain Status</dt>
                  <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      evidence.blockchain_stored ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {evidence.blockchain_stored ? 'Stored on Blockchain' : 'Stored Locally'}
                    </span>
                  </dd>
                </div>
                {evidence.txid && (
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 font-mono">
                      {evidence.txid}
                    </dd>
                  </div>
                )}
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">AI Verification</dt>
                  <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      evidence.verification?.authentic ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {evidence.verification?.authentic ? 'Authentic' : 'Suspicious'}
                    </span>
                    {evidence.verification?.confidence && (
                      <span className="ml-2 text-gray-500">
                        Confidence: {Math.round(evidence.verification.confidence * 100)}%
                      </span>
                    )}
                  </dd>
                </div>
                {evidence.verification?.analysis && (
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">Analysis</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {evidence.verification.analysis}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
            <div className="px-4 py-5 sm:px-6 bg-gray-50 flex justify-between">
              <Link href="/evidence" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Back to Evidence Vault
              </Link>
              <div>
                <button
                  onClick={() => window.open(`http://localhost:8001/evidence/${evidence.hash}/download`, '_blank')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 mr-3"
                >
                  Download Evidence
                </button>
                <button
                  onClick={() => alert('Verification report would be generated here')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <p className="text-gray-500">No evidence found with hash: {hash}</p>
            <div className="mt-6">
              <Link href="/evidence" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                Return to Evidence Vault
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
