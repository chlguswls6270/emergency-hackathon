import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { apiConfig } from '../services/api';

const Camp = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
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
    window.location.reload();
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        🤝 {hackathonSlug ? `Camp for ${hackathonSlug}` : 'Global Hackathon Camp'}
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Find your dream team or recruit talented individuals.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        <div>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Active Teams</h2>
          {loading ? <div className="loading">Loading teams...</div> : camps.length === 0 ? <div className="no-data">No teams found yet. Be the first to create one!</div> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {camps.map((c, i) => (
                <div key={i} className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent-primary)' }}>{c.name}</span>
                    <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: c.isOpen ? 'rgba(34, 197, 94, 0.2)' : 'var(--glass-border)', color: c.isOpen ? '#86efac' : 'var(--text-secondary)' }}>
                      {c.isOpen ? 'Recruiting' : 'Closed'}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{c.intro}</p>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Looking For:</strong>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                      {c.lookingFor?.map(role => (
                        <span key={role} style={{ fontSize: '0.75rem', background: 'var(--glass-border)', padding: '0.2rem 0.6rem', borderRadius: '12px' }}>{role}</span>
                      ))}
                    </div>
                  </div>

                  <a href={c.contact?.url} target="_blank" rel="noreferrer" className="glow-button" style={{ display: 'block', textAlign: 'center', padding: '0.5rem', fontSize: '0.9rem' }}>
                    Contact Team
                  </a>
                </div>
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
