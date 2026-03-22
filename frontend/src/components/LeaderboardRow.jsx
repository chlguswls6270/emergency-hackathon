import React from 'react';

const LeaderboardRow = ({ rank, nickname, points, isTop3, isLocal, onUndo, unit }) => {
  return (
    <tr className="leaderboard-row">
      <td style={{ padding: '1rem', fontWeight: 'bold', color: isTop3 ? 'var(--accent-primary)' : 'inherit' }}>
        {rank === 1 ? '🥇 1' : rank === 2 ? '🥈 2' : rank === 3 ? '🥉 3' : rank}
      </td>
      <td style={{ padding: '1rem' }}>
        {nickname}
        {isLocal && onUndo && (
          <button 
            onClick={() => onUndo(nickname)} 
            style={{ marginLeft: '1rem', background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', cursor: 'pointer', borderRadius: '4px', padding: '0.15rem 0.5rem', fontSize: '0.75rem', transition: 'background 0.2s' }}
            onMouseEnter={(e) => { e.target.style.background = 'rgba(239, 68, 68, 0.1)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'transparent'; }}
          >
            Undo
          </button>
        )}
      </td>
      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 'bold' }}>
        {typeof points === 'number' ? points.toLocaleString() : points}
        {unit && <span style={{ marginLeft: '0.2rem', fontSize: '0.85em', color: 'var(--text-secondary)', fontWeight: 'normal' }}>{unit}</span>}
      </td>
    </tr>
  );
};

export default LeaderboardRow;
