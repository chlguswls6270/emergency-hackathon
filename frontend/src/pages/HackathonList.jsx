import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiConfig } from '../services/api';
import HackathonCard from '../components/HackathonCard';
import { LoadingState, EmptyState, ErrorState } from '../components/StateComponents';

const HackathonList = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedTag, setSelectedTag] = useState('All');

  useEffect(() => {
    apiConfig.fetchHackathons().then(data => {
      setHackathons(data);
      setLoading(false);
    }).catch(() => {
      setError(true);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingState message="Loading Hackathons..." />;
  if (error) return <ErrorState message="Failed to load hackathons." />;
  if (!hackathons.length && selectedTag === 'All') return <EmptyState message="No hackathons found..." />;

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

      {filteredHackathons.length === 0 ? <EmptyState message="No hackathons matched the selected tag." /> : (
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
