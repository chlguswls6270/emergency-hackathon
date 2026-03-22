import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiConfig } from '../services/api';
import HackathonCard from '../components/HackathonCard';

const HackathonList = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('All');

  useEffect(() => {
    apiConfig.fetchHackathons().then(data => {
      setHackathons(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loading">Loading Hackathons...</div>;
  if (!hackathons.length && selectedTag === 'All') return <div className="no-data">No hackathons found...</div>;

  const allTags = ['All', ...new Set(hackathons.flatMap(h => h.tags || []))];
  const filteredHackathons = selectedTag === 'All' ? hackathons : hackathons.filter(h => h.tags?.includes(selectedTag));

  return (
    <div style={{ marginTop: '2rem' }}>
      <Link to="/" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'inline-block' }}>
        ← Go back to Home
      </Link>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '2.5rem' }}>🔥 Discover Hackathons</h1>
      
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {allTags.map(tag => (
          <button 
            key={tag} 
            onClick={() => setSelectedTag(tag)}
            className="tag-badge"
            style={{ 
              background: selectedTag === tag ? 'var(--accent-primary)' : 'var(--glass-border)',
              color: selectedTag === tag ? 'white' : 'inherit',
              border: 'none', cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.9rem'
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {filteredHackathons.length === 0 ? <div className="no-data">No hackathons matched the selected tag.</div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {filteredHackathons.map((h) => (
            <HackathonCard key={h.slug} hackathon={h} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HackathonList;
