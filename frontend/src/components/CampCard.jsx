import React, { useState, useEffect } from 'react';
import { apiConfig } from '../services/api';

const CampCard = ({ camp, onDelete }) => {
  const { name, isOpen, intro, lookingFor, contact, teamCode, hackathonSlug } = camp;
  const isLocal = teamCode && teamCode.startsWith('T-LOCAL-');
  const isGlobal = !hackathonSlug || hackathonSlug === 'global';

  const [offers, setOffers] = useState([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteSender, setInviteSender] = useState('');

  useEffect(() => {
    if (isLocal) {
      apiConfig.getOffers(hackathonSlug, teamCode).then(setOffers);
    }
  }, [isLocal, hackathonSlug, teamCode]);

  const handleSendOffer = async (e) => {
    e.preventDefault();
    if (!inviteSender) return alert('초대할 이름이나 팀명을 입력해주세요');
    await apiConfig.sendOffer(hackathonSlug, teamCode, inviteSender);
    alert('모집 제안이 성공적으로 전송되었습니다!');
    setShowInviteForm(false);
    setInviteSender('');
  };

  const handleUpdateOffer = async (offerId, status) => {
    await apiConfig.updateOffer(hackathonSlug, offerId, status);
    const updated = await apiConfig.getOffers(hackathonSlug, teamCode);
    setOffers(updated);
  };

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
          {isOpen ? '모집 중' : '마감'}
        </span>
      </div>
      
      <div style={{ marginBottom: '0.75rem' }}>
        <span className="tag-badge" style={{ backgroundColor: isGlobal ? 'rgba(168, 85, 247, 0.2)' : 'rgba(59, 130, 246, 0.2)', color: isGlobal ? '#d8b4fe' : '#93c5fd', fontSize: '0.7rem', display: 'inline-block' }}>
          {isGlobal ? '🌐 글로벌 / 미분류' : `🎯 ${hackathonSlug}`}
        </span>
      </div>

      <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>{intro}</p>
      
      <div style={{ marginBottom: '1rem' }}>
        <strong style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>모집 분야:</strong>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
          {lookingFor?.length > 0 ? lookingFor.map(role => (
            <span key={role} className="tag-badge">{role}</span>
          )) : <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>없음</span>}
        </div>
      </div>

      {/* Contact & Offer Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <a href={contact?.url} target="_blank" rel="noreferrer" className="glow-button" style={{ display: 'block', textAlign: 'center', padding: '0.4rem', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          팀에 연락하기
        </a>

        {!isLocal ? (
          <div>
            {!showInviteForm ? (
              <button onClick={() => setShowInviteForm(true)} className="glow-button" style={{ display: 'block', width: '100%', textAlign: 'center', padding: '0.4rem', fontSize: '0.9rem', background: 'var(--glass-border)' }}>
                초대 / 제안 보내기
              </button>
            ) : (
              <form onSubmit={handleSendOffer} style={{ display: 'flex', gap: '0.5rem' }}>
                <input required placeholder="이름 또는 팀명" value={inviteSender} onChange={e => setInviteSender(e.target.value)} style={{ flex: 1, padding: '0.4rem', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '0.8rem' }} />
                <button type="submit" className="glow-button" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>전송</button>
              </form>
            )}
          </div>
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--accent-primary)' }}>받은 제안 ({offers.length})</h4>
            {offers.length === 0 ? <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>대기 중인 제안이 없습니다.</p> : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {offers.map(o => (
                  <li key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                    <span>보낸 사람: <strong>{o.fromUserOrTeam}</strong></span>
                    {o.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button onClick={() => handleUpdateOffer(o.id, 'accepted')} className="glow-button" style={{ background: '#10b981', padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>수락</button>
                        <button onClick={() => handleUpdateOffer(o.id, 'rejected')} className="glow-button" style={{ background: '#ef4444', padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>거절</button>
                      </div>
                    ) : (
                      <span className="tag-badge" style={{ fontSize: '0.7rem', color: o.status === 'accepted' ? '#10b981' : '#ef4444' }}>{o.status}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampCard;
