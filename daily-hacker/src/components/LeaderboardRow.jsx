import React from 'react';
import { apiConfig } from '../services/api';

const LeaderboardRow = ({ rank, nickname, points, isTop3, isLocal, onUndo, unit, artifactFilename }) => {
  return (
    <tr className="leaderboard-row" style={{ background: isLocal ? 'rgba(0, 0, 0, 0.08)' : 'transparent' }}>
      <td style={{ padding: '0.75rem 1rem', fontWeight: 'bold', color: isTop3 ? 'var(--accent-primary)' : 'inherit' }}>
        {rank === 1 ? '🥇 1' : rank === 2 ? '🥈 2' : rank === 3 ? '🥉 3' : rank}
      </td>
      <td style={{ padding: '0.75rem 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span>{nickname}</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
          {artifactFilename && (
            <button type="button" onClick={() => apiConfig.downloadArtifact(artifactFilename).catch(() => window.alert('파일을 다운로드하지 못했습니다.'))} className="glow-button" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', textDecoration: 'none' }}>
              ⬇ 다운로드
            </button>
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
          </div>
        </div>
      </td>
      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>
        {typeof points === 'number' ? points.toLocaleString() : points}
        {unit && <span style={{ marginLeft: '0.2rem', fontSize: '0.85em', color: 'var(--text-secondary)', fontWeight: 'normal' }}>{unit}</span>}
      </td>
    </tr>
  );
};

export default LeaderboardRow;

