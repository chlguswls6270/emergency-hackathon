import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import HackathonList from './pages/HackathonList';
import HackathonDetail from './pages/HackathonDetail';
import Camp from './pages/Camp';
import Rankings from './pages/Rankings';
import HackathonCard from './components/HackathonCard';
import CampCard from './components/CampCard';
import { LoadingState } from './components/StateComponents';
import { apiConfig } from './services/api';
import OwlPostBox from './components/OwlPostBox';

const Home = () => {
  const [hackathons, setHackathons] = useState([]);
  const [camps, setCamps] = useState([]);
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(16);

  useEffect(() => {
    Promise.all([
      apiConfig.fetchHackathons(),
      apiConfig.fetchCampData()
    ]).then(([hData, cData]) => {
      setHackathons(hData);
      setCamps(cData);
      setParticipations(apiConfig.getParticipations());
      setLoading(false);
    });
  }, []);

  const mixedFeed = [];
  const maxLength = Math.max(hackathons.length, camps.length);
  for (let i = 0; i < maxLength; i++) {
    if (hackathons[i]) mixedFeed.push({ type: 'hackathon', data: hackathons[i] });
    if (camps[i]) mixedFeed.push({ type: 'camp', data: camps[i] });
  }

  // Generate fake lists for sidebars based on available mock data
  const upcomingDeadlines = hackathons.length > 0 ? [hackathons[0], hackathons[hackathons.length - 1]].filter(Boolean) : [];
  const hotHackathons = hackathons.length > 1 ? [hackathons[1], hackathons[2]].filter(Boolean) : [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)', y: 20 }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(5px)', y: -10 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{ textAlign: 'center', marginTop: '4rem' }}
    >
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.2rem', fontStyle: 'italic' }}>
        새로운 도전을 찾고, 팀을 구성하여 미래를 만들어보세요.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '1440px', margin: '0 auto' }}>
        <Link to="/hackathons" className="glass-card" style={{ display: 'block', textDecoration: 'none' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>해커톤</h2>
          <p style={{ color: 'var(--text-secondary)' }}>오늘의 특종을 찾아 신청하세요.</p>
        </Link>
        <Link to="/camp" className="glass-card" style={{ display: 'block', textDecoration: 'none' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>개발자 구인</h2>
          <p style={{ color: 'var(--text-secondary)' }}>파티를 구성할 개발자를 찾습니다.</p>
        </Link>
        <Link to="/rankings" className="glass-card" style={{ display: 'block', textDecoration: 'none' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>명예의 전당</h2>
          <p style={{ color: 'var(--text-secondary)' }}>가장 뛰어난 개발자들의 순위입니다.</p>
        </Link>
      </div>

      <div style={{ marginTop: '5rem', display: 'flex', flexWrap: 'wrap', gap: '3rem', alignItems: 'flex-start', textAlign: 'left' }}>
        
        {/* LEFT SIDEBAR (Dynamic Panels) */}
        <aside className="home-sidebar">
          <div style={{ paddingBottom: '2rem', marginBottom: '2rem', borderBottom: '1px dashed var(--border-color)' }}>
            <h3 className="magical-serif" style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>📌 나의 참가 내역</h3>
            {participations.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {participations.map(p => (
                  <li key={p.slug} style={{ marginBottom: '0.75rem', lineHeight: '1.4' }}>
                    <Link to={`/hackathons/${p.slug}`} style={{ textDecoration: 'underline', transition: 'opacity 0.2s' }}>{p.title}</Link>
                  </li>
                ))}
              </ul>
            ) : <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>아직 신청한 기사가 없습니다.</p>}
          </div>

          <div style={{ paddingBottom: '2rem', marginBottom: '2rem', borderBottom: '1px dashed var(--border-color)' }}>
             <h3 className="magical-serif" style={{ fontSize: '1.4rem', marginBottom: '1rem', color: 'var(--accent-hover)' }}>⏳ 마감 임박 특종</h3>
             {upcomingDeadlines.length > 0 ? upcomingDeadlines.map((h, i) => (
               <div key={`d-${i}`} style={{ marginBottom: '1rem' }}>
                 <strong><Link to={`/hackathons/${h.slug}`}>{h.title}</Link></strong>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>[D-Day Approaching] 서두르세요!</div>
               </div>
             )) : <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>데이터 없음</p>}
          </div>

          <div>
             <h3 className="magical-serif" style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>🔥 장안의 화제</h3>
             {hotHackathons.length > 0 ? hotHackathons.map((h, i) => (
               <div key={`hot-${i}`} style={{ marginBottom: '1rem' }}>
                 <strong><Link to={`/hackathons/${h.slug}`}>{h.title}</Link></strong>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>수많은 마법사가 주목 중입니다.</div>
               </div>
             )) : <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>데이터 없음</p>}
          </div>
        </aside>

        {/* MAIN FEED (Masonry Layout) */}
        <section style={{ flex: '3', minWidth: '400px' }}>
          <h2 className="magical-serif" style={{ fontSize: '2.5rem', borderBottom: '4px solid var(--border-color)', borderTop: '1px solid var(--border-color)', padding: '0.5rem 0', marginBottom: '2rem', textAlign: 'center' }}>
            🗞️ 발행된 특종 보도
          </h2>
          
          {loading ? <LoadingState message="전속 부엉이가 기사를 싣고 오는 중..." /> : (
            <>
              <div className="masonry-feed">
                {mixedFeed.slice(0, displayCount).map((item, i) => (
                  <div key={`mix-${item.type}-${i}`} style={{ breakInside: 'avoid', marginBottom: '2rem' }}>
                    {item.type === 'hackathon' 
                      ? <HackathonCard hackathon={item.data} />
                      : <CampCard camp={item.data} />}
                  </div>
                ))}
              </div>
              {displayCount < mixedFeed.length && (
                <div style={{ textAlign: 'center', marginTop: '3rem', width: '100%' }}>
                  <button 
                    onClick={() => setDisplayCount(prev => prev + 8)} 
                    className="glow-button"
                    style={{ fontSize: '1rem', padding: '0.8rem 2rem', letterSpacing: '2px' }}
                  >
                    ▶ 다음 페이지 넘기기 ◀
                  </button>
                </div>
              )}
            </>
          )}
        </section>

      </div>
    </motion.div>
  );
};

function App() {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path) && path !== '/' ? 'active' : '';

  return (
    <div className="app-container">
      <motion.nav 
        className="navbar"
        initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="nav-header-top">
          <span>{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}</span>
          <span>SPECIAL EDITION: THE HACKER'S PROPHET</span>
          <span>PRICE: 1 KNUT</span>
        </div>
        <Link to="/" className="nav-logo">The Daily Hacker</Link>
        <div className="nav-links">
          <Link to="/hackathons" className={`nav-button ${isActive('/hackathons')}`}>해커톤</Link>
          <Link to="/camp" className={`nav-button ${isActive('/camp')}`}>구인 광고</Link>
          <Link to="/rankings" className={`nav-button ${isActive('/rankings')}`}>명예의 전당</Link>
        </div>
      </motion.nav>

      <main className="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/hackathons" element={<HackathonList />} />
            <Route path="/hackathons/:slug" element={<HackathonDetail />} />
            <Route path="/camp" element={<Camp />} />
            <Route path="/rankings" element={<Rankings />} />
          </Routes>
        </AnimatePresence>
      </main>
      <OwlPostBox />
    </div>
  );
}

export default App;
