import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiConfig } from '../services/api';
import CampCard from '../components/CampCard';

const Camp = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchParams] = useSearchParams();
  const hackathonSlug = searchParams.get('hackathon');

  // Form State
  const [formData, setFormData] = useState({ name: '', intro: '', lookingFor: '', contact: '' });

  useEffect(() => {
    apiConfig.fetchCampData(hackathonSlug).then(data => {
      setCamps(data);
      setLoading(false);
    });
  }, [hackathonSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await apiConfig.createCamp({ 
      name: formData.name, 
      intro: formData.intro, 
      hackathonSlug: hackathonSlug || 'global',
      isOpen: true,
      lookingFor: formData.lookingFor.split(','),
      contact: { type: 'link', url: formData.contact },
      memberCount: 1,
      createdAt: new Date().toISOString()
    });
    alert('Team Registered Successfully! Saved to local storage.');
    
    // Refresh camps list without full reload
    const updatedCamps = await apiConfig.fetchCampData(hackathonSlug);
    setCamps(updatedCamps);
    setFormData({ name: '', intro: '', lookingFor: '', contact: '' });
  };

  const handleDelete = async (teamCode) => {
    if (window.confirm("Are you sure you want to delete this team?")) {
      await apiConfig.deleteCamp(teamCode);
      setCamps(camps.filter(c => c.teamCode !== teamCode));
    }
  };

  const dynamicSlugs = new Set();
  camps.forEach(c => {
    if (c.hackathonSlug && c.hackathonSlug !== 'global') {
      dynamicSlugs.add(c.hackathonSlug);
    }
  });
  const allTags = ['All', 'global', ...dynamicSlugs];
  const filteredCamps = selectedTag === 'All' ? camps : camps.filter(c => (c.hackathonSlug || 'global') === selectedTag);

  return (
    <div style={{ marginTop: '2rem' }}>
      <Link to="/" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'inline-block' }}>
        ← Go back to Home
      </Link>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        🤝 {hackathonSlug ? `Camp for ${hackathonSlug}` : 'Global Hackathon Camp'}
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Find your dream team or recruit talented individuals.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        <div>
          <h2 style={{ marginBottom: '1.2rem', fontSize: '1.5rem' }}>Active Teams</h2>
          
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {allTags.map(tag => (
              <button 
                key={tag} 
                onClick={() => setSelectedTag(tag)}
                className="tag-badge"
                style={{ 
                  background: selectedTag === tag ? 'var(--accent-primary)' : 'var(--glass-border)',
                  color: selectedTag === tag ? 'white' : 'inherit',
                  border: 'none', cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.85rem'
                }}
              >
                {tag === 'global' ? 'Global / Uncategorized' : tag}
              </button>
            ))}
          </div>

          {loading ? <div className="loading">Loading teams...</div> : filteredCamps.length === 0 ? <div className="no-data">No teams found in this category. Be the first to create one!</div> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {filteredCamps.map((c, i) => (
                <CampCard key={i} camp={c} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>

        <div className="glass-card" style={{ position: 'sticky', top: '100px' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Create a Team</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input required type="text" placeholder="Team Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
            <textarea required placeholder="Team Introduction" value={formData.intro} onChange={e => setFormData({...formData, intro: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white', minHeight: '80px' }} />
            <input placeholder="Looking For (comma separated)" value={formData.lookingFor} onChange={e => setFormData({...formData, lookingFor: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
            <input required type="text" placeholder="Contact URL (Slack/Discord/Kakao)" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
            <button type="submit" className="glow-button">Register Team</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Camp;
