import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiConfig } from '../services/api';
import CampCard from '../components/CampCard';
import LeaderboardRow from '../components/LeaderboardRow';
import { LoadingState, EmptyState, ErrorState } from '../components/StateComponents';

const Section = ({ title, children, emoji }) => (
  <div className="glass-card" style={{ marginBottom: '2rem' }}>
    <h3 className="magical-serif" style={{ borderBottom: '2px dashed var(--text-primary)', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1.4rem' }}>
      {title}
    </h3>
    <div style={{ padding: '0.5rem 0' }}>{children}</div>
  </div>
);

const HackathonDetail = () => {
  const { slug } = useParams();
  const [detail, setDetail] = useState(null);
  const [camps, setCamps] = useState([]);
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isParticipating, setIsParticipating] = useState(false);

  // Mock Form State
  const [submitNotes, setSubmitNotes] = useState('');
  const [teamCode, setTeamCode] = useState('');
  const [submitFile, setSubmitFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      apiConfig.fetchHackathonDetail(slug),
      apiConfig.fetchCampData(slug),
      apiConfig.fetchLeaderboard(slug)
    ]).then(([detailData, campData, leaderboardData]) => {
      setDetail(detailData);
      setCamps(campData);
      setLeaderboard(leaderboardData);
      
      const parts = apiConfig.getParticipations();
      if (parts.find(p => p.slug === slug)) {
        setIsParticipating(true);
      }
      
      setLoading(false);
    }).catch(() => {
      setError(true);
      setLoading(false);
    });
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamCode) return alert('팀 코드를 입력해주세요');
    if (!submitFile) return alert('제출할 파일을 첨부해주세요');
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('hackathonSlug', slug);
      formData.append('teamCode', teamCode);
      formData.append('notes', submitNotes);
      formData.append('file', submitFile);

      await apiConfig.submitProject(slug, formData);
      const updatedLeaderboard = await apiConfig.fetchLeaderboard(slug);
      setLeaderboard(updatedLeaderboard);
      setSubmitNotes('');
      setTeamCode('');
      setSubmitFile(null);
      alert('프로젝트가 성공적으로 제출되었습니다!');
    } catch (err) {
      alert('오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCampDelete = async (teamCode) => {
    if (window.confirm("정말로 이 팀을 삭제하시겠습니까?")) {
      await apiConfig.deleteCamp(teamCode);
      setCamps(camps.filter(c => c.teamCode !== teamCode));
    }
  };

  const handleUndoSubmit = async (teamCode) => {
    if (window.confirm("정말로 제출을 취소하시겠습니까?")) {
      await apiConfig.undoSubmit(slug, teamCode);
      const updatedLeaderboard = await apiConfig.fetchLeaderboard(slug);
      setLeaderboard(updatedLeaderboard);
    }
  };

  const handleParticipate = () => {
    if (isParticipating) {
      apiConfig.cancelParticipation(slug);
      setIsParticipating(false);
      alert('참가 신청이 취소되었습니다.');
    } else {
      apiConfig.participateInHackathon(detail);
      setIsParticipating(true);
      alert('해커톤 참가 신청이 완료되었습니다!');
    }
  };

  const getCombinedLeaderboard = () => {
    let finalEntries = [...(leaderboard?.entries || [])];
    if (camps.length > 0) {
      const submittedTeamNames = finalEntries.map(e => e.teamName || e.nickname);
      camps.forEach(c => {
        if (!submittedTeamNames.includes(c.name)) {
          finalEntries.push({
            rank: '-',
            teamName: c.name,
            score: 'Not submitted yet',
            isLocal: false
          });
        }
      });
    }
    return finalEntries;
  };

  const entriesToShow = getCombinedLeaderboard();

  if (loading) return <LoadingState message="해커톤 정보를 불러오는 중..." />;
  if (error || !detail) return <ErrorState message="해커톤 정보를 찾을 수 없습니다." />;

  // Sometimes JSON is nested inside `sections`, extracting it carefully:
  const content = detail.sections || detail;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40, filter: 'blur(15px)' }} 
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} 
      exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }} 
      transition={{ duration: 0.5, ease: "easeOut" }} 
      style={{ marginTop: '1rem', perspective: '1000px' }}
    >
      <Link to="/hackathons" style={{ color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'inline-block', borderBottom: '1px solid var(--text-primary)' }}>
        ← 해커톤 목록으로
      </Link>
      
      <h1 className="magical-title" style={{ fontSize: '3.5rem', marginBottom: '1rem', borderBottom: '4px solid var(--text-primary)', borderTop: '4px solid var(--text-primary)', padding: '1.5rem 0', textAlign: 'center' }}>
        {detail.title || '해커톤 이름'}
      </h1>

      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <button 
          onClick={handleParticipate} 
          className="glow-button" 
          style={{ 
            fontSize: '1.1rem', 
            background: isParticipating ? 'var(--text-primary)' : 'transparent', 
            color: isParticipating ? 'var(--bg-primary)' : 'var(--text-primary)', 
            cursor: 'pointer' 
          }}
        >
          {isParticipating ? '❌ 참가 신청 취소' : '📝 해커톤 참가 신청하기'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
        <div className="left-column">
          {/* 1. Overview */}
          <Section title="Overview (안내/개요)" emoji="📌">
            <div className="newspaper-columns">
              <p>{content.overview?.summary || '제공된 개요가 없습니다.'}</p>
              <ul style={{ marginTop: '1rem', marginLeft: '1.5rem', color: 'var(--text-secondary)' }}>
                {content.info?.notice?.map((n, i) => <li key={i} style={{marginBottom: '0.5rem'}}>{n}</li>)}
              </ul>
            </div>
          </Section>

          {/* 2. Schedule */}
          <Section title="Schedule (일정)" emoji="📅">
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {content.schedule?.milestones?.map((m, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px dashed var(--border-color)' }}>
                  <span>{m.name}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{new Date(m.at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* 3. Evaluation */}
          <Section title="Evaluation (평가)" emoji="⚖️">
            <p><strong>평가 기준:</strong> {content.eval?.metricName}</p>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>{content.eval?.description}</p>
          </Section>

          {/* 4. Prize */}
          <Section title="Prize (상금)" emoji="💰">
            {content.prize?.items ? (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                {content.prize.items.map((p, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center', border: '2px solid var(--border-color)', padding: '1rem' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent-primary)' }}>{p.place}</div>
                    <div>{p.amountKRW.toLocaleString()} KRW</div>
                  </div>
                ))}
              </div>
            ) : <p>상금 정보가 없습니다.</p>}
          </Section>

          {/* 5. Submit */}
          <Section title="Submit (제출)" emoji="🚀">
            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              {content.submit?.guide?.[0] || '여기에 최종 결과물을 제출하세요.'}
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input required type="text" placeholder="팀명 또는 코드" value={teamCode} onChange={(e) => setTeamCode(e.target.value)} style={{ padding: '0.75rem', borderRadius: '0', border: '1px solid var(--border-color)' }} />
              <input required type="file" onChange={e => setSubmitFile(e.target.files[0])} style={{ padding: '0.75rem', borderRadius: '0', border: '1px solid var(--border-color)', fontSize: '0.9rem' }} />
              <textarea 
                placeholder="추가 설명 (선택)..." 
                value={submitNotes} 
                onChange={e => setSubmitNotes(e.target.value)}
                style={{ padding: '0.75rem', borderRadius: '0', border: '1px solid var(--border-color)', minHeight: '80px' }} 
              />
              <button type="submit" disabled={isSubmitting} className={isSubmitting ? "glow-button submitting" : "glow-button"} style={{ opacity: isSubmitting ? 0.7 : 1 }}>
                {isSubmitting ? '부엉이가 문서를 나르는 중... 🦉' : '대시보드에 제출'}
              </button>
            </form>
          </Section>
        </div>

        <div className="right-column">
          {/* 6. Teams / Camp */}
          <Section title="Teams (팀/캠프)" emoji="🤝">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {camps.length > 0 ? camps.map((c, i) => (
                <CampCard key={i} camp={c} onDelete={handleCampDelete} />
              )) : <EmptyState message="팀이 없습니다." icon="🤷" />}
            </div>
            <Link to={`/camp?hackathon=${slug}`} className="glow-button" style={{ display: 'block', textAlign: 'center' }}>
              전체 캠프 보기
            </Link>
          </Section>

          {/* 7. Leaderboard */}
          <Section title="Leaderboard (리더보드)" emoji="🏆">
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {entriesToShow.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
                  <tbody>
                    {entriesToShow.slice(0, 10).map((r, i) => (
                      <LeaderboardRow 
                        key={i} 
                        rank={r.rank} 
                        nickname={r.nickname || r.teamName} 
                        points={r.points || r.score} 
                        isTop3={r.rank === 1 || r.rank === 2 || r.rank === 3} 
                        isLocal={r.isLocal}
                        artifactFilename={r.artifactFilename}
                        onUndo={handleUndoSubmit}
                        unit={r.score !== 'Not submitted yet' && r.score !== 'Pending' ? leaderboard?.unit : null}
                      />
                    ))}
                  </tbody>
                </table>
              ) : <EmptyState message="아직 제출된 내역이 없습니다." />}
              
              <Link to={`/rankings`} className="glow-button" style={{ display: 'block', textAlign: 'center', marginTop: '1rem' }}>
                글로벌 랭킹 보기
              </Link>
            </div>
          </Section>
        </div>
      </div>
    </motion.div>
  );
};

export default HackathonDetail;
