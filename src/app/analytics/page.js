"use client";
import { useState, useEffect } from 'react';

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalEvidence: 0,
    verifiedCount: 0,
    blockchainStored: 0,
    systemStatus: 'Loading...'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        // Check system status
        const statusResponse = await fetch('http://localhost:8001/');
        const statusData = await statusResponse.json();
        
        // Get evidence list
        const evidenceResponse = await fetch('http://localhost:8001/evidence');
        const evidenceData = await evidenceResponse.json();
        
        // Calculate stats
        const totalEvidence = evidenceData.evidence.length;
        
        // For demo purposes, we'll simulate some verified/blockchain stats
        const verifiedCount = Math.floor(totalEvidence * 0.8); // 80% verified
        const blockchainStored = statusData.blockchain_enabled ? 
          Math.floor(totalEvidence * 0.9) : 0; // 90% on blockchain if enabled
        
        setStats({
          totalEvidence,
          verifiedCount,
          blockchainStored,
          systemStatus: statusData.blockchain_enabled ? 'Fully Operational' : 'Blockchain Offline'
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setStats({
          ...stats,
          systemStatus: 'Error: Backend connection failed'
        });
        setLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, []);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
        
        {/* Main Analytics Dashboard */}
        <div className="mt-6">
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-600">Loading analytics data...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Evidence */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Total Evidence
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {stats.totalEvidence}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Verified Evidence */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            AI Verified
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {stats.verifiedCount}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:px-6">
                    <div className="text-sm">
                      <span className="font-medium text-green-600">
                        {`${Math.round((stats.verifiedCount / (stats.totalEvidence || 1)) * 100)}%`} verification rate
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Blockchain Stored */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Blockchain Stored
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {stats.blockchainStored}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-4 sm:px-6">
                    <div className="text-sm">
                      <span className="font-medium text-indigo-600">
                        {`${Math.round((stats.blockchainStored / (stats.totalEvidence || 1)) * 100)}%`} of evidence
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* System Status */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 rounded-md p-3 ${
                        stats.systemStatus === 'Fully Operational' ? 'bg-green-500' : 
                        stats.systemStatus.includes('Error') ? 'bg-red-500' : 'bg-yellow-500'
                      }`}>
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            System Status
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              {stats.systemStatus}
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Analytics Charts */}
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* Evidence Growth Chart */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">Evidence Growth</h3>
                    <div className="mt-4 h-64 flex items-center justify-center">
                      <div className="w-full h-full bg-gray-100 rounded-lg p-4 flex flex-col justify-end">
                        <div className="flex items-end h-full space-x-2">
                          {[15, 25, 40, 30, 45, 75, 70].map((height, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center">
                              <div 
                                className="w-full bg-blue-500 rounded-t"
                                style={{ height: `${height}%` }}
                              ></div>
                              <div className="text-xs text-gray-500 mt-1">
                                Day {i+1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-gray-500 text-center">
                      Evidence uploads over the last 7 days
                    </div>
                  </div>
                </div>
                
                {/* Verification Ratio Chart */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">Verification Results</h3>
                    <div className="mt-4 h-64 flex items-center justify-center">
                      <div className="relative w-48 h-48">
                        {/* Simulated pie chart */}
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                          {/* Verified slice - 80% */}
                          <path
                            d="M 50 50 L 50 0 A 50 50 0 0 1 97.55 34.55 Z"
                            fill="#10B981"
                          />
                          {/* Unverified slice - 15% */}
                          <path
                            d="M 50 50 L 97.55 34.55 A 50 50 0 0 1 93.3 65.45 Z"
                            fill="#F59E0B"
                          />
                          {/* Rejected slice - 5% */}
                          <path
                            d="M 50 50 L 93.3 65.45 A 50 50 0 1 1 50 0 Z"
                            fill="#EF4444"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-gray-800">80%</div>
                            <div className="text-xs text-gray-500">Verified</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-xs text-gray-600">Verified (80%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                        <span className="text-xs text-gray-600">Uncertain (15%)</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span className="text-xs text-gray-600">Rejected (5%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Blockchain Performance Metrics */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Blockchain Performance</h3>
                  <div className="mt-4">
                    <dl className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                      <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Average Confirmation Time
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                          2.4s
                        </dd>
                      </div>
                      <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Network Nodes
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                          4
                        </dd>
                      </div>
                      <div className="px-4 py-5 bg-gray-50 shadow rounded-lg overflow-hidden sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Storage Efficiency
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">
                          98%
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
