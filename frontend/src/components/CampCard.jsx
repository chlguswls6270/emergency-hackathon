import React, { useState, useEffect } from 'react';
import { apiConfig } from '../services/api';
import OwlSendModal from './OwlSendModal';

const CampCard = ({ camp, onDelete }) => {
  const { name, isOpen, intro, lookingFor, contact, teamCode, hackathonSlug } = camp;
  const isLocal = teamCode && teamCode.startsWith('T-LOCAL-');
  const isGlobal = !hackathonSlug || hackathonSlug === 'global';

  const [offers, setOffers] = useState([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [inviteSender, setInviteSender] = useState('');
  const [showOwlModal, setShowOwlModal] = useState(false);

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
    <div className="glass-card camp-card" style={{ position: 'relative', borderTop: '6px solid var(--text-primary)' }}>
      {isLocal && onDelete && (
        <button 
          onClick={(e) => { e.preventDefault(); onDelete(teamCode); }}
          className="danger-btn"
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: '1px solid', cursor: 'pointer', fontSize: '1rem', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
          title="팀 삭제"
        >
          ✕
        </button>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem', paddingRight: isLocal ? '2rem' : '0' }}>
        <span className="magical-serif" style={{ fontWeight: 'bold', fontSize: '1.4rem', color: 'var(--text-primary)', textTransform: 'uppercase', flex: 1, wordBreak: 'break-word', marginRight: '0.5rem', lineHeight: '1.2' }}>{name}</span>
        <span className={`status-badge ${isOpen ? 'ongoing' : 'ended'}`} style={{ flexShrink: 0, marginTop: '4px' }}>
          {isOpen ? '모집 중' : '마감'}
        </span>
      </div>
      
      <div style={{ marginBottom: '0.75rem' }}>
        <span className="tag-badge">
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
          <div style={{ width: '100%', overflow: 'hidden' }}>
            {!showInviteForm ? (
              <button onClick={() => setShowInviteForm(true)} className="glow-button" style={{ display: 'block', width: '100%', boxSizing: 'border-box', textAlign: 'center', padding: '0.4rem', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                초대 / 제안 보내기
              </button>
            ) : (
              <form onSubmit={handleSendOffer} style={{ display: 'flex', gap: '0.5rem', width: '100%', boxSizing: 'border-box', marginBottom: '0.5rem' }}>
                <input required placeholder="이름 또는 팀명" value={inviteSender} onChange={e => setInviteSender(e.target.value)} style={{ flex: 1, minWidth: 0, padding: '0.5rem', border: '1px solid var(--border-color)', fontSize: '0.85rem', boxSizing: 'border-box' }} />
                <button type="submit" className="glow-button" style={{ flexShrink: 0, padding: '0.5rem 1rem', fontSize: '0.85rem', boxSizing: 'border-box' }}>등록</button>
              </form>
            )}
            <button onClick={() => setShowOwlModal(true)} className="glow-button" style={{ display: 'block', width: '100%', backgroundColor: '#5a4b3c', color: '#f4ecd8', border: 'none', boxSizing: 'border-box', textAlign: 'center', padding: '0.5rem', fontSize: '0.9rem' }}>
              비밀 부엉이 편지 보내기 🦉
            </button>
          </div>
        ) : (
          <div style={{ border: '2px dashed var(--border-color)', padding: '0.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', marginBottom: '0.5rem', color: 'var(--text-primary)', fontFamily: 'Cinzel, serif' }}>받은 제안 ({offers.length})</h4>
            {offers.length === 0 ? <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>대기 중인 제안이 없습니다.</p> : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {offers.map(o => (
                  <li key={o.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', borderBottom: '1px solid var(--border-color)' }}>
                    <span>보낸 사람: <strong>{o.fromUserOrTeam}</strong></span>
                    {o.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button onClick={() => handleUpdateOffer(o.id, 'accepted')} className="glow-button" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>수락</button>
                        <button onClick={() => handleUpdateOffer(o.id, 'rejected')} className="glow-button" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}>거절</button>
                      </div>
                    ) : (
                      <span className="tag-badge" style={{ fontSize: '0.7rem' }}>{o.status}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <OwlSendModal 
        isOpen={showOwlModal} 
        onClose={() => setShowOwlModal(false)} 
        targetTeam={name || teamCode} 
      />
    </div>
  );
};

export default CampCard;
