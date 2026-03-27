import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiConfig } from '../services/api';
import LeaderboardRow from '../components/LeaderboardRow';
import { LoadingState, EmptyState, ErrorState } from '../components/StateComponents';

const Rankings = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [days, setDays] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(false);
    apiConfig.fetchRankings(days)
      .then(data => {
        setRankings(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [days]);

  return (
    <div style={{ marginTop: '2rem', maxWidth: '800px', margin: '2rem auto 0 auto' }}>
      <Link to="/" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'inline-block' }}>
        ← Go back to Home
      </Link>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', textAlign: 'center' }}>🏆 Global Rankings</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center' }}>
        The top performers across all hackathons.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => setDays(7)} className="tag-badge" style={{ background: days === 7 ? 'var(--accent-primary)' : 'var(--glass-border)', color: days === 7 ? 'white' : 'inherit', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}>Past 7 Days</button>
        <button onClick={() => setDays(30)} className="tag-badge" style={{ background: days === 30 ? 'var(--accent-primary)' : 'var(--glass-border)', color: days === 30 ? 'white' : 'inherit', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}>Past 30 Days</button>
        <button onClick={() => setDays(null)} className="tag-badge" style={{ background: days === null ? 'var(--accent-primary)' : 'var(--glass-border)', color: days === null ? 'white' : 'inherit', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}>All Time</button>
      </div>

      {loading ? <LoadingState message="Loading Rankings..." /> : error ? <ErrorState message="Failed to load rankings" /> : rankings.length === 0 ? <EmptyState message="No rankings to display" /> : (
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
                <LeaderboardRow 
                  key={i} 
                  rank={r.rank} 
                  nickname={r.nickname || r.teamName} 
                  points={r.points || r.score} 
                  isTop3={i < 3} 
                  unit="pts"
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Rankings;
