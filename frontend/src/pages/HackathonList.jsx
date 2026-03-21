import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiConfig } from '../services/api';

const HackathonList = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiConfig.fetchHackathons().then(data => {
      setHackathons(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loading">Loading Hackathons...</div>;
  if (!hackathons.length) return <div className="no-data">No hackathons found...</div>;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem' }}>🔥 Discover Hackathons</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {hackathons.map((h) => (
          <Link to={`/hackathons/${h.slug}`} key={h.slug} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '140px', background: `url(${h.thumbnailUrl}) center/cover`, borderRadius: '8px', marginBottom: '1rem', backgroundColor: 'var(--bg-secondary)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ 
                padding: '0.2rem 0.6rem', 
                borderRadius: '12px', 
                fontSize: '0.8rem', 
                fontWeight: '600',
                background: h.status === 'ongoing' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                color: h.status === 'ongoing' ? '#93c5fd' : 'var(--text-secondary)'
              }}>
                {h.status.toUpperCase()}
              </span>
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{h.title}</h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {h.tags?.map(t => (
                <span key={t} style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'var(--glass-border)', borderRadius: '4px' }}>#{t}</span>
              ))}
            </div>
            <div style={{ marginTop: 'auto', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Ends: {new Date(h.period?.endAt).toLocaleDateString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HackathonList;
