'use client'; // To use React hooks like useState in this file
import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { AiOutlineDownload, AiOutlineCopy } from 'react-icons/ai';
import './globals.css'; // Importing the CSS file

export default function Home() {
  const [repoUrl, setRepoUrl] = useState('');
  const [tone, setTone] = useState('professional');
  const [wordLimit, setWordLimit] = useState(50); // Default word limit
  const [customWordLimit, setCustomWordLimit] = useState(''); // For custom input
  const [readme, setReadme] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleWordLimitChange = (e) => {
    const value = e.target.value;
    if (value === 'custom') {
      setWordLimit('custom');
    } else {
      setWordLimit(Number(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const limit = wordLimit === 'custom' ? Number(customWordLimit) : wordLimit;
      const response = await fetch('/api/generate-readme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl, tone, wordLimit: limit }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate README');
      }
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

  const downloadReadme = () => {
    const blob = new Blob([readme], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    a.click();
  };

  const handleReset = () => {
    setRepoUrl('');
    setTone('professional');
    setReadme('');
    setLoading(false);
    setError('');
    setWordLimit(50);
  };

  return (
    <div className="container">
      <h2>Generate README for GitHub Repo</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="block">
            URL of GitHub Repo:
            <input
              type="text"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="Enter GitHub Repo URL"
            />
          </label>
        </div>
        <div className="form-group">
          <label className="block">
            Tone:
            <select value={tone} onChange={(e) => setTone(e.target.value)}>
              <option value="professional">Professional</option>
              <option value="creative">Creative</option>
              <option value="funny">Funny</option>
              <option value="interesting">Interesting</option>
              <option value="formal">Formal</option>
              <option value="casual">Casual</option>
              <option value="friendly">Friendly</option>
            </select>
          </label>
        </div>
        <div className="form-group">
          <label className="block">
            Word Limit:
            <select value={wordLimit} onChange={handleWordLimitChange}>
              <option value={50}>50 words</option>
              <option value={100}>100 words</option>
              <option value={200}>200 words</option>
              <option value={500}>500 words</option>
              <option value="custom">Custom</option>
            </select>
          </label>
          {wordLimit === 'custom' && (
            <input
              type="number"
              value={customWordLimit}
              onChange={(e) => setCustomWordLimit(e.target.value)}
              placeholder="Enter custom word limit"
            />
          )}
        </div>
        <div className="flex-buttons">
          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Generate README'}
          </button>
          <button type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>
      {error && <p className="error">{error}</p>}
      {readme && (
        <div>
          <textarea value={readme} readOnly rows={10}></textarea>
          <div className="flex-buttons">
            <button onClick={downloadReadme}>
              <AiOutlineDownload /> Download README
            </button>
            <CopyToClipboard text={readme} onCopy={() => alert('README copied to clipboard!')}>
              <button>
                <AiOutlineCopy /> Copy README
              </button>
            </CopyToClipboard>
          </div>
        </div>
      )}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Diya Agrawal. All rights reserved🐼.</p>
      </footer>
    </div>
  );
}
