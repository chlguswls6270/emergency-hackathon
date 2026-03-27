import React from 'react';
import { Link } from 'react-router-dom';

const HackathonCard = ({ hackathon }) => {
  const { slug, thumbnailUrl, status, title, tags, period, startDate, participantCount } = hackathon;
  
  return (
    <Link to={`/hackathons/${slug}`} className="glass-card hackathon-card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div 
        className="card-image"
        style={{ 
          height: '140px', 
          background: `url(${thumbnailUrl}) center/cover`, 
          borderRadius: '8px', 
          marginBottom: '1rem', 
          backgroundColor: 'var(--bg-secondary)' 
        }} 
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span className={`status-badge ${status}`}>
          {status.toUpperCase()}
        </span>
      </div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{title}</h3>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {tags?.map(t => (
          <span key={t} className="tag-badge">#{t}</span>
        ))}
      </div>
      <div style={{ marginTop: 'auto', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          {startDate && <div style={{ marginBottom: '0.2rem' }}>시작일: {new Date(startDate).toLocaleDateString()}</div>}
          <div>종료일: {new Date(period?.endAt).toLocaleDateString()}</div>
        </div>
        <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
          👥 {participantCount || 0}개 팀
        </div>
      </div>
    </Link>
  );
};

export default HackathonCard;
