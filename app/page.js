'use client'; // To use React hooks like useState in this file

import { useState } from 'react';

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [tone, setTone] = useState('professional');
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/generate-readme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl, tone }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setReadme(data.readme);
      }
    } catch (err) {
      setError('Error generating README');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">Generate README for GitHub Repo</h2>
        <div className="mt-8 space-y-6">
          <input
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="Enter GitHub Repo URL"
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="professional">Professional</option>
            <option value="creative">Creative</option>
            <option value="funny">Funny</option>
            <option value="interesting">Interesting</option>
          </select>
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate README'}
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {readme && (
            <div className="mt-4 bg-white p-4 rounded-md shadow-md">
              <h3 className="font-bold text-xl">Generated README</h3>
              <pre className="whitespace-pre-wrap break-words mt-2">{readme}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
