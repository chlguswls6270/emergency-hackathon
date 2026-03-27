import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import HackathonList from './pages/HackathonList'
import HackathonDetail from './pages/HackathonDetail'
import Camp from './pages/Camp'
import Rankings from './pages/Rankings'

const Home = () => (
  <div style={{ textAlign: 'center', marginTop: '4rem' }}>
    <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
      HackPlatform
    </h1>
    <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.2rem' }}>
      새로운 도전을 찾고, 팀을 구성하여 미래를 만들어보세요.
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
      <Link to="/hackathons" className="glass-card" style={{ display: 'block', textDecoration: 'none' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🚀 해커톤</h2>
        <p style={{ color: 'var(--text-secondary)' }}>다음 목표를 찾고 신청하세요.</p>
      </Link>
      <Link to="/camp" className="glass-card" style={{ display: 'block', textDecoration: 'none' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🤝 팀 찾기</h2>
        <p style={{ color: 'var(--text-secondary)' }}>기존 팀에 합류하거나 팀원을 모집하세요.</p>
      </Link>
      <Link to="/rankings" className="glass-card" style={{ display: 'block', textDecoration: 'none' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏆 랭킹</h2>
        <p style={{ color: 'var(--text-secondary)' }}>모든 해커톤의 상위 랭커를 확인하세요.</p>
      </Link>
    </div>
  </div>
);

function App() {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path) && path !== '/' ? 'active' : '';

  // Auth / Role mock toggle logic
  const [role, setRole] = React.useState(localStorage.getItem('mockRole') || '참가자');

  const toggleRole = () => {
    const roles = ['방문자', '참가자', '심사위원'];
    const nextRole = roles[(roles.indexOf(role) + 1) % roles.length];
    setRole(nextRole);
    localStorage.setItem('mockRole', nextRole);
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <Link to="/" className="nav-logo">HackPlatform</Link>
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/hackathons" className={`nav-button ${isActive('/hackathons')}`}>해커톤</Link>
          <Link to="/camp" className={`nav-button ${isActive('/camp')}`}>캠프</Link>
          <Link to="/rankings" className={`nav-button ${isActive('/rankings')}`}>랭킹</Link>
          <button onClick={toggleRole} className="glow-button" style={{ marginLeft: '1rem', padding: '0.5rem 1rem', fontSize: '0.8rem', background: role === '심사위원' ? '#f59e0b' : role === '방문자' ? '#64748b' : '#3b82f6' }}>
            권한: {role}
          </button>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hackathons" element={<HackathonList />} />
          <Route path="/hackathons/:slug" element={<HackathonDetail />} />
          <Route path="/camp" element={<Camp />} />
          <Route path="/rankings" element={<Rankings />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
