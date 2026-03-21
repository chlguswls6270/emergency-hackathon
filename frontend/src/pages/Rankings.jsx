import React, { useEffect, useState } from 'react';
import { apiConfig } from '../services/api';

const Rankings = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Usually uses global rankings endpoint, currently mocked in API
    fetch('http://localhost:8000/api/rankings')
      .then(res => res.json())
      .then(data => {
        setRankings(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ marginTop: '2rem', maxWidth: '800px', margin: '2rem auto 0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>🏆 Global Rankings</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', textAlign: 'center' }}>
        The top performers across all hackathons.
      </p>

      {loading ? <div className="loading">Loading Rankings...</div> : (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>Rank</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>Nickname</th>
                <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '1px solid var(--border-color)' }}>Total Points</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s', ':hover': { background: 'rgba(255, 255, 255, 0.02)' } }}>
                  <td style={{ padding: '1rem', fontWeight: 'bold', color: i < 3 ? 'var(--accent-primary)' : 'inherit' }}>
                    {i === 0 ? '🥇 1' : i === 1 ? '🥈 2' : i === 2 ? '🥉 3' : r.rank}
                  </td>
                  <td style={{ padding: '1rem' }}>{r.nickname}</td>
                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>{r.points.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Rankings;
