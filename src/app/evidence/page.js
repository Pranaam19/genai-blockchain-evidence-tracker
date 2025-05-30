"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EvidencePage() {
  const [evidence, setEvidence] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvidence = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching evidence from API...');
        
        // Use a proxy approach to avoid CORS issue
        // This will make the request through the Next.js server
        const response = await fetch('/api/evidence', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          },
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch evidence: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Evidence data:', data);
        
        // The API returns { evidence: [...] } format
        const evidenceArray = data.evidence || [];
        setEvidence(Array.isArray(evidenceArray) ? evidenceArray : []);
      } catch (err) {
        console.error('Error fetching evidence:', err);
        setError(err.message || 'An error occurred while fetching evidence');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvidence();
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
    setIsLoading(false);
    setError(null);
  };

  // Handle download with error handling
  const handleDownload = async (hash) => {
    try {
      // Check if the file exists first
      const response = await fetch(`http://localhost:8001/evidence/${hash}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        alert(`Cannot download file: ${hash}. The file may not exist or the server is unavailable.`);
        return;
      }
      
      // If the file exists, open the download URL in a new tab
      window.open(`http://localhost:8001/evidence/${hash}/download`, '_blank');
    } catch (err) {
      console.error('Download error:', err);
      alert(`Error downloading file: ${err.message}`);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Evidence Vault</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:px-6 bg-blue-700 text-white">
            <h2 className="text-xl font-semibold">Secure Evidence Repository</h2>
            <p className="mt-1 text-sm text-blue-100">
              All evidence is cryptographically verified and blockchain-secured
            </p>
          </div>
          
          {isLoading ? (
            <div className="px-4 py-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500">Loading evidence...</p>
            </div>
          ) : error ? (
            <div className="px-4 py-5 sm:p-6 text-center">
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
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 mr-3"
                >
                  Retry
                </button>
                <button
                  onClick={createMockEvidence}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 mr-3"
                >
                  Use Demo Data
                </button>
                <Link href="/upload" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                  Upload New Evidence
                </Link>
              </div>
            </div>
          ) : evidence.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No evidence files</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by uploading your first evidence file.</p>
              <div className="mt-6">
                <Link href="/upload" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                  Upload Evidence
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File Hash
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {evidence.map((item) => (
                    <tr key={item.hash || Math.random().toString()} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
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
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.timestamp ? new Date(item.timestamp).toLocaleString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {item.hash && (
                          <>
                            <button
                              onClick={() => handleDownload(item.hash)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              Download
                            </button>
                            <Link
                              href={`/evidence/${item.hash}`}
                              className="text-green-600 hover:text-green-900"
                            >
                              Details
                            </Link>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
