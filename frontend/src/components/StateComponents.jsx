import React from 'react';

export const LoadingState = ({ message = 'Loading...' }) => (
  <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
    <div className="loading-spinner" style={{
      width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)',
      borderTop: '3px solid var(--accent-primary)', borderRadius: '50%',
      animation: 'spin 1s linear infinite', margin: '0 auto 1.5rem auto'
    }}></div>
    <p style={{ fontSize: '1.1rem' }}>{message}</p>
    <style>{`
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `}</style>
  </div>
);

export const EmptyState = ({ icon = '📭', message = 'No data available.', actionLabel, onAction }) => (
  <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
    <div style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: 0.6 }}>{icon}</div>
    <p style={{ fontSize: '1.1rem', marginBottom: actionLabel ? '2rem' : '0' }}>{message}</p>
    {actionLabel && onAction && (
      <button onClick={onAction} className="glow-button">{actionLabel}</button>
    )}
  </div>
);

export const ErrorState = ({ message = 'An unexpected error occurred.', onRetry }) => (
  <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', borderColor: 'rgba(239, 68, 68, 0.4)' }}>
    <div style={{ fontSize: '3rem', marginBottom: '1.5rem', opacity: 0.8 }}>⚠️</div>
    <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: onRetry ? '2rem' : '0' }}>{message}</p>
    {onRetry && (
      <button onClick={onRetry} className="glow-button" style={{ background: '#ef4444' }}>Try Again</button>
    )}
  </div>
);
