import React, { useState } from 'react';
import OwlSendModal from './OwlSendModal';

const LeaderboardRow = ({ rank, nickname, points, isTop3, isLocal, onUndo, unit, artifactFilename }) => {
  const [showOwlModal, setShowOwlModal] = useState(false);

  return (
    <>
    <tr className="leaderboard-row" style={{ background: isLocal ? 'rgba(0, 0, 0, 0.08)' : 'transparent' }}>
      <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold', color: isTop3 ? 'var(--accent-primary)' : 'inherit' }}>
        {rank === 1 ? '🥇 1' : rank === 2 ? '🥈 2' : rank === 3 ? '🥉 3' : rank}
      </td>
      <td style={{ padding: '0.75rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span>{nickname}</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
          {artifactFilename && (
            <a href={`http://localhost:8000/api/download/${artifactFilename}`} download className="glow-button" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', textDecoration: 'none' }}>
              ⬇ 다운로드
            </a>
          )}
          {isLocal && onUndo && (
            <button 
              onClick={() => onUndo(nickname)} 
              className="glow-button danger-btn"
              style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
            >
              제출 취소
            </button>
          )}
          <button 
            onClick={() => setShowOwlModal(true)} 
            className="glow-button"
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', border: '1px solid #5a4b3c', background: '#f4ecd8', color: '#5a4b3c' }}
          >
            🦉 편지쓰기
          </button>
          </div>
        </div>
      </td>
      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>
        {typeof points === 'number' ? points.toLocaleString() : points}
        {unit && <span style={{ marginLeft: '0.2rem', fontSize: '0.85em', color: 'var(--text-secondary)', fontWeight: 'normal' }}>{unit}</span>}
      </td>
    </tr>
    <OwlSendModal 
      isOpen={showOwlModal} 
      onClose={() => setShowOwlModal(false)} 
      targetTeam={nickname} 
    />
    </>
  );
};

export default LeaderboardRow;
