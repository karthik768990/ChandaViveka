import { useState, useEffect } from 'react';
import api from '../services/api'; // Our axios instance

const ChandasAnalyzer = () => {
  const [shloka, setShloka] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [chandasList, setChandasList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all available chandas types on component mount
  useEffect(() => {
    const fetchChandas = async () => {
      try {
        const { data } = await api.get('/chandas');
        if (data.success) {
          setChandasList(data.data);
        }
      } catch (err) {
        console.error("Error fetching chandas list", err);
      }
    };
    fetchChandas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const { data } = await api.post('/chandas/analyze', { shloka });
      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Chandas Analyzer (Protected Route)</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="5"
          cols="60"
          value={shloka}
          onChange={(e) => setShloka(e.target.value)}
          placeholder="Enter your śloka here (Devanagari or IAST). Try a full verse!"
          style={{ display: 'block', margin: '10px 0' }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {analysis && (
        <div style={{ marginTop: '20px' }}>
          <h3>Analysis Result</h3>
          <p>
            <strong>Identified Chandas:</strong> {analysis.identifiedChandas || 'Unknown'}
          </p>
          
          {/* --- NEWLY ADDED --- */}
          <p>
  <strong>Laghu/Guru Pattern (by Pāda):</strong>
  <br />
  {analysis.pattern?.byPada?.map((p, idx) => (
    <code 
      key={idx} 
      style={{ 
        background: '#eee', 
        padding: '2px 4px', 
        letterSpacing: '2px', 
        display: 'block', 
        margin: '4px 0' 
      }}
    >
      {p}
    </code>
  ))}
</p>

<p>
  <strong>Combined Pattern:</strong>
  <code 
    style={{ background: '#eee', padding: '2px 4px', letterSpacing: '2px' }}
  >
    {analysis.pattern?.combined || 'N/A'}
  </code>
</p>

          {/* --- END NEW --- */}
          
          <p>
            <strong>Explanation:</strong> {analysis.explanation}
          </p>
          <pre style={{ background: '#eee', padding: '10px' }}>
            {JSON.stringify(analysis.input, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Available Chandas in DB</h3>
        <ul>
          {chandasList.length > 0 ? (
            chandasList.map((c) => (
              <li key={c.id || c.name}>{c.name} {c.pattern && `- ${c.pattern}`}</li>
            ))
          ) : (
            <p>Loading chandas list...</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ChandasAnalyzer;