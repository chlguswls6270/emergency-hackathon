import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiConfig } from '../services/api';
import CampCard from '../components/CampCard';
import { LoadingState, EmptyState, ErrorState } from '../components/StateComponents';

const Camp = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchParams] = useSearchParams();
  const hackathonSlug = searchParams.get('hackathon');

  // Form State
  const [formData, setFormData] = useState({ name: '', intro: '', lookingFor: '', contact: '' });

  useEffect(() => {
    apiConfig.fetchCampData(hackathonSlug).then(data => {
      setCamps(data);
      setLoading(false);
    }).catch(() => {
      setError(true);
      setLoading(false);
    });
  }, [hackathonSlug]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiConfig.createCamp({ 
        name: formData.name, 
        intro: formData.intro, 
        hackathonSlug: hackathonSlug || 'global',
        isOpen: true,
        lookingFor: formData.lookingFor.split(','),
        contact: { type: 'link', url: formData.contact },
        memberCount: 1,
        createdAt: new Date().toISOString()
      });
      alert('팀 등록이 완료되었습니다!');
      
      // Refresh camps list without full reload
      const updatedCamps = await apiConfig.fetchCampData(hackathonSlug);
      setCamps(updatedCamps);
      setFormData({ name: '', intro: '', lookingFor: '', contact: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (teamCode) => {
    if (window.confirm("정말로 이 팀을 삭제하시겠습니까?")) {
      await apiConfig.deleteCamp(teamCode);
      setCamps(camps.filter(c => c.teamCode !== teamCode));
    }
  };

  const dynamicSlugs = new Set();
  camps.forEach(c => {
    if (c.hackathonSlug && c.hackathonSlug !== 'global') {
      dynamicSlugs.add(c.hackathonSlug);
    }
  });
  const allTags = ['All', 'global', ...dynamicSlugs];
  const filteredCamps = selectedTag === 'All' ? camps : camps.filter(c => (c.hackathonSlug || 'global') === selectedTag);

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
      <h1 className="magical-title" style={{ fontSize: '3rem', marginBottom: '1rem', borderBottom: '4px solid var(--text-primary)', paddingBottom: '0.5rem' }}>
        🤝 {hackathonSlug ? `캠프 - ${hackathonSlug}` : '글로벌 해커톤 캠프'}
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        꿈의 팀을 찾거나 능력 있는 팀원을 모집하세요.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
        <div>
          <h2 style={{ marginBottom: '1.2rem', fontSize: '1.5rem' }}>활동 중인 팀</h2>
          
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
                {tag === 'global' ? '글로벌 / 미분류' : tag === 'All' ? '전체' : tag}
              </button>
            ))}
          </div>

          {loading ? <LoadingState message="팀 불러오는 중..." /> : error ? <ErrorState message="팀을 불러오지 못했습니다." /> : filteredCamps.length === 0 ? <EmptyState message="이 카테고리에는 팀이 없습니다. 첫 번째 팀을 만들어보세요!" /> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {filteredCamps.map((c, i) => (
                <CampCard key={i} camp={c} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>

        <div className="glass-card" style={{ position: 'sticky', top: '100px' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>팀 만들기</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
            <input 
              required 
              type="text" 
              placeholder="팀명" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              style={{ padding: '0.75rem', borderRadius: '0', border: '1px solid var(--border-color)' }} 
            />
            <textarea 
              required 
              placeholder="팀 소개" 
              value={formData.intro} 
              onChange={e => setFormData({...formData, intro: e.target.value})} 
              style={{ padding: '0.75rem', borderRadius: '0', border: '1px solid var(--border-color)', minHeight: '80px' }} 
            />
            <input 
              placeholder="모집 분야 (쉼표로 구분)" 
              value={formData.lookingFor} 
              onChange={e => setFormData({...formData, lookingFor: e.target.value})} 
              style={{ padding: '0.75rem', borderRadius: '0', border: '1px solid var(--border-color)' }} 
            />
            <input 
              required 
              type="text" 
              placeholder="연락처 URL (Slack/Discord/Kakao)" 
              value={formData.contact} 
              onChange={e => setFormData({...formData, contact: e.target.value})} 
              style={{ padding: '0.75rem', borderRadius: '0', border: '1px solid var(--border-color)' }} 
            />
            <button type="submit" disabled={isSubmitting} className="glow-button" style={{ opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? '파티 결성 요청 중... 📜' : '팀 등록'}
            </button>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default Camp;
