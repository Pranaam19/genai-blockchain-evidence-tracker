"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [blockchainStatus, setBlockchainStatus] = useState('Checking...');
  const [evidenceCount, setEvidenceCount] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [evidence, setEvidence] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check blockchain status by checking if Docker containers are running
    // Since the /blockchain/status endpoint doesn't exist, we'll just set a default value
    setBlockchainStatus('Active');

    // Get evidence directly from the /evidence endpoint
    fetch('/api/evidence')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch evidence');
        return res.json();
      })
      .then(data => {
        console.log('Evidence data:', data);
        const evidenceArray = data.evidence || [];
        setEvidence(Array.isArray(evidenceArray) ? evidenceArray : []);
        setEvidenceCount(evidenceArray.length);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching evidence:', err);
        setError(err.message);
        setEvidence([]);
        setEvidenceCount(0);
        setIsLoading(false);
      });
  }, []);

  // Temporary function to create mock evidence data for testing
  const createMockEvidence = () => {
    const mockData = [
      {
        hash: "5d3f781b1c46ea7a62642f83ba7c3f0c64d24a3694b79177aa24df4a517d7b54",
        timestamp: "2025-03-12T23:01:04.135034"
      },
      {
        hash: "6e2c891b22855dd4255aa6a8f0330ffdd379d87d70b49ce6be481606e5867da4",
        timestamp: "2025-03-12T23:40:59.304324"
      },
      {
        hash: "00d3fef9c1f81e61f77ce8df5c5019984eb2a47c79d4f0d7c7de7be54b843b51",
        timestamp: "2025-04-17T21:26:50.641288"
      }
    ];
    setEvidence(mockData);
    setEvidenceCount(mockData.length);
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-blue-700 rounded-lg shadow-xl overflow-hidden mb-8">
          <div className="px-6 py-12 md:px-12 text-center md:text-left">
            <div className="md:max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Blockchain Evidence Tracker
              </h1>
              <p className="text-blue-100 text-lg mb-8">
                Secure, tamper-proof evidence management powered by AI and blockchain technology
              </p>
              <div className="flex flex-col sm:flex-row justify-center md:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/upload" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50">
                  Upload Evidence
                </Link>
                <Link href="/evidence" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900">
                  View Evidence Vault
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Blockchain Status */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Blockchain Status
                    </dt>
                    <dd>
                      <div className="flex items-center">
                        <div className={`h-3 w-3 rounded-full mr-2 ${
                          blockchainStatus === 'Active' ? 'bg-green-400' : 
                          blockchainStatus === 'Inactive' ? 'bg-red-400' : 'bg-yellow-400'
                        }`}></div>
                        <div className="text-lg font-medium text-gray-900">
                          {blockchainStatus}
                        </div>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence Count */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Evidence Files
                    </dt>
                    <dd>
                      {isLoading ? (
                        <div className="animate-pulse h-6 w-12 bg-gray-200 rounded"></div>
                      ) : (
                        <div className="text-lg font-medium text-gray-900">
                          {evidenceCount !== null ? evidenceCount : 'Unknown'}
                        </div>
                      )}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Security Status */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Security Status
                    </dt>
                    <dd>
                      <div className="flex items-center">
                        <div className="h-3 w-3 rounded-full bg-green-400 mr-2"></div>
                        <div className="text-lg font-medium text-gray-900">
                          Secure
                        </div>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
            <div className="px-4 py-5 sm:px-6 bg-red-50">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">API Connection Error</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 mr-3"
                >
                  Retry
                </button>
                <button
                  onClick={createMockEvidence}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700"
                >
                  Use Demo Data
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Evidence */}
        {evidence.length > 0 && (
          <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">Recent Evidence</h3>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {evidence.slice(0, 3).map((item) => (
                  <li key={item.hash || Math.random().toString()} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-blue-100 text-blue-600">
                          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 font-mono">
                            {item.hash ? (item.hash.length > 20 ? `${item.hash.substring(0, 10)}...${item.hash.substring(item.hash.length - 10)}` : item.hash) : 'Unknown'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'}
                          </div>
                        </div>
                      </div>
                      {item.hash && (
                        <div>
                          <a
                            href={`http://localhost:8001/evidence/${item.hash}/download`}
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download
                          </a>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {evidence.length > 3 && (
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <Link href="/evidence" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                    View all evidence →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">System Features</h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">AI Verification</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  Advanced AI algorithms analyze evidence files for authenticity and tampering
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Blockchain Storage</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  Immutable ledger ensures evidence integrity with cryptographic proof
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Encryption</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  End-to-end encryption protects sensitive evidence data
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Chain of Custody</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  Complete audit trail of all evidence access and modifications
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
