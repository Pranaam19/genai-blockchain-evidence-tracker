"use client"; 
import { useState } from 'react';

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    try {
      setStatus('Uploading...');
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8001/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setStatus(`File uploaded successfully! Transaction ID: ${data.txid}`);
      } else {
        setStatus(`Upload failed: ${data.detail || data.message || 'Server error occurred'}`);
        console.error('Upload error:', data);
      }
    } catch (error) {
      setStatus(`Error: ${error.message || 'Network error occurred'}`);
      console.error('Upload error:', error);
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
    </div>
  );
}
