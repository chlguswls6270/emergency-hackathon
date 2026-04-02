import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiConfig } from '../services/api';
import HackathonCard from '../components/HackathonCard';
import { LoadingState, EmptyState, ErrorState } from '../components/StateComponents';

const HackathonList = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedTag, setSelectedTag] = useState('All');

  useEffect(() => {
    apiConfig.fetchHackathons().then(data => {
      setHackathons(data);
      setLoading(false);
    }).catch(() => {
      setError(true);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingState message="해커톤 불러오는 중..." />;
  if (error) return <ErrorState message="해커톤을 불러오지 못했습니다." />;
  if (!hackathons.length && selectedTag === 'All') return <EmptyState message="해커톤을 찾을 수 없습니다..." />;

  const allTags = ['All', ...new Set(hackathons.flatMap(h => h.tags || []))];
  const filteredHackathons = selectedTag === 'All' ? hackathons : hackathons.filter(h => h.tags?.includes(selectedTag));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }} 
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} 
      exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }} 
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ marginTop: '2rem' }}
    >
      <Link to="/" style={{ color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'inline-block', borderBottom: '1px solid var(--text-primary)' }}>
        ← 홈으로 돌아가기
      </Link>
      <h1 className="magical-title" style={{ marginBottom: '1.5rem', fontSize: '3rem', borderBottom: '4px solid var(--text-primary)', paddingBottom: '0.5rem' }}>
        특종: 해커톤 탐색
      </h1>
      
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {allTags.map(tag => (
          <button 
            key={tag} 
            onClick={() => setSelectedTag(tag)}
            className="tag-badge"
            style={{ 
              background: selectedTag === tag ? 'var(--text-primary)' : 'transparent',
              color: selectedTag === tag ? 'var(--bg-primary)' : 'inherit',
              cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '0.85rem'
            }}
          >
            {tag === 'All' ? '전체' : tag}
          </button>
        ))}
      </div>

      {filteredHackathons.length === 0 ? <EmptyState message="선택한 태그와 일치하는 해커톤이 없습니다." /> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {filteredHackathons.map((h) => (
            <HackathonCard key={h.slug} hackathon={h} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default HackathonList;
