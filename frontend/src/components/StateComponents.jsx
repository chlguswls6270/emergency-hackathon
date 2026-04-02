import React from 'react';

export const LoadingState = ({ message = '로딩 중...' }) => (
  <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-primary)' }}>
    <h2 className="magical-title" style={{ fontSize: '2rem', animation: 'pulse 1.5s infinite alternate' }}>
      ❖ {message} ❖
    </h2>
    <style>{`
      @keyframes pulse { 0% { opacity: 0.5; } 100% { opacity: 1; } }
    `}</style>
  </div>
);

export const EmptyState = ({ icon = '📭', message = '데이터가 없습니다.', actionLabel, onAction }) => (
  <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-primary)' }}>
    <div style={{ fontSize: '3rem', marginBottom: '1.5rem', filter: 'grayscale(1)' }}>{icon}</div>
    <p style={{ fontSize: '1.2rem', marginBottom: actionLabel ? '2rem' : '0', fontFamily: 'Cinzel, serif' }}>{message}</p>
    {actionLabel && onAction && (
      <button onClick={onAction} className="glow-button">{actionLabel}</button>
    )}
  </div>
);

export const ErrorState = ({ message = '예기치 않은 오류가 발생했습니다.', onRetry }) => (
  <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', borderColor: 'var(--accent-hover)', borderWidth: '4px' }}>
    <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>⚠️</div>
    <p style={{ color: 'var(--accent-hover)', fontSize: '1.2rem', fontWeight: '700', marginBottom: onRetry ? '2rem' : '0' }}>{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="glow-button">다시 시도</button>
    )}
  </div>
);
