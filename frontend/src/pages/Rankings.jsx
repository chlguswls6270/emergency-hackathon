import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiConfig } from '../services/api';
import LeaderboardRow from '../components/LeaderboardRow';
import { LoadingState, EmptyState, ErrorState } from '../components/StateComponents';

const Rankings = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [days, setDays] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(false);
    apiConfig.fetchRankings(days)
      .then(data => {
        setRankings(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [days]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }} 
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} 
      exit={{ opacity: 0, y: -20, filter: 'blur(5px)' }} 
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ marginTop: '2rem', maxWidth: '800px', margin: '2rem auto 0 auto' }}
    >
      <Link to="/" style={{ color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'inline-block', borderBottom: '1px solid var(--text-primary)' }}>
        ← 홈으로 돌아가기
      </Link>
      <h1 className="magical-title" style={{ fontSize: '3rem', marginBottom: '1rem', textAlign: 'center', borderBottom: '4px solid var(--text-primary)', paddingBottom: '0.5rem' }}>🏆 명예의 전당</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center' }}>
        모든 해커톤의 최고 성과자들입니다.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => setDays(7)} className="tag-badge" style={{ background: days === 7 ? 'var(--text-primary)' : 'transparent', color: days === 7 ? 'var(--bg-primary)' : 'inherit', cursor: 'pointer', padding: '0.5rem 1rem' }}>최근 7일</button>
        <button onClick={() => setDays(30)} className="tag-badge" style={{ background: days === 30 ? 'var(--text-primary)' : 'transparent', color: days === 30 ? 'var(--bg-primary)' : 'inherit', cursor: 'pointer', padding: '0.5rem 1rem' }}>최근 30일</button>
        <button onClick={() => setDays(null)} className="tag-badge" style={{ background: days === null ? 'var(--text-primary)' : 'transparent', color: days === null ? 'var(--bg-primary)' : 'inherit', cursor: 'pointer', padding: '0.5rem 1rem' }}>전체 기간</button>
      </div>

      {loading ? <LoadingState message="랭킹 불러오는 중..." /> : error ? <ErrorState message="랭킹을 불러오지 못했습니다." /> : rankings.length === 0 ? <EmptyState message="표시할 랭킹이 없습니다." /> : (
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid var(--border-color)' }}>
            <thead style={{ background: 'rgba(0, 0, 0, 0.05)', borderBottom: '2px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>순위</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>닉네임</th>
                <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '1px solid var(--border-color)' }}>총점</th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((r, i) => (
                <LeaderboardRow 
                  key={i} 
                  rank={r.rank} 
                  nickname={r.nickname || r.teamName} 
                  points={r.points || r.score} 
                  isTop3={i < 3} 
                  unit="pts"
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default Rankings;
