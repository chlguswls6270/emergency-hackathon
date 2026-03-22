import React from 'react';

const CampCard = ({ camp, onDelete }) => {
  const { name, isOpen, intro, lookingFor, contact, teamCode, hackathonSlug } = camp;
  const isLocal = teamCode && teamCode.startsWith('T-LOCAL-');
  const isGlobal = !hackathonSlug || hackathonSlug === 'global';

  return (
    <div className="glass-card camp-card" style={{ position: 'relative' }}>
      {isLocal && onDelete && (
        <button 
          onClick={(e) => { e.preventDefault(); onDelete(teamCode); }}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(239, 68, 68, 0.2)', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1rem', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s' }}
          title="Delete Team"
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          ✕
        </button>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem', paddingRight: isLocal ? '2rem' : '0' }}>
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent-primary)' }}>{name}</span>
        <span className={`status-badge ${isOpen ? 'ongoing' : 'ended'}`}>
          {isOpen ? 'Recruiting' : 'Closed'}
        </span>
      </div>
      
      <div style={{ marginBottom: '0.75rem' }}>
        <span className="tag-badge" style={{ backgroundColor: isGlobal ? 'rgba(168, 85, 247, 0.2)' : 'rgba(59, 130, 246, 0.2)', color: isGlobal ? '#d8b4fe' : '#93c5fd', fontSize: '0.7rem', display: 'inline-block' }}>
          {isGlobal ? '🌐 Global / Uncategorized' : `🎯 ${hackathonSlug}`}
        </span>
      </div>

      <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{intro}</p>
      
      <div style={{ marginBottom: '1rem' }}>
        <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Looking For:</strong>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
          {lookingFor?.length > 0 ? lookingFor.map(role => (
            <span key={role} className="tag-badge">{role}</span>
          )) : <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>None</span>}
        </div>
      </div>

      <a href={contact?.url} target="_blank" rel="noreferrer" className="glow-button" style={{ display: 'block', textAlign: 'center', padding: '0.5rem', fontSize: '0.9rem' }}>
        Contact Team
      </a>
    </div>
  );
};

export default CampCard;
