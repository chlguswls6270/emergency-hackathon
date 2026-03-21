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
      Discover, team up, and build the future.
    </p>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
      <Link to="/hackathons" className="glass-card" style={{ display: 'block', textDecoration: 'none' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🚀 Explore Hackathons</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Find your next challenge and register.</p>
      </Link>
      <Link to="/camp" className="glass-card" style={{ display: 'block', textDecoration: 'none' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🤝 Find a Team (/camp)</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Join an existing team or recruit members.</p>
      </Link>
      <Link to="/rankings" className="glass-card" style={{ display: 'block', textDecoration: 'none' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🏆 Global Rankings</h2>
        <p style={{ color: 'var(--text-secondary)' }}>See top hackers across all events.</p>
      </Link>
    </div>
  </div>
);

function App() {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path) && path !== '/' ? 'active' : '';

  // Auth / Role mock toggle logic
  const [role, setRole] = React.useState(localStorage.getItem('mockRole') || 'Participant');
  
  const toggleRole = () => {
    const roles = ['Visitor', 'Participant', 'Judge'];
    const nextRole = roles[(roles.indexOf(role) + 1) % roles.length];
    setRole(nextRole);
    localStorage.setItem('mockRole', nextRole);
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <Link to="/" className="nav-logo">HackPlatform</Link>
        <div className="nav-links" style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/hackathons" className={`nav-button ${isActive('/hackathons')}`}>Hackathons</Link>
          <Link to="/camp" className={`nav-button ${isActive('/camp')}`}>Camp</Link>
          <Link to="/rankings" className={`nav-button ${isActive('/rankings')}`}>Rankings</Link>
          <button onClick={toggleRole} className="glow-button" style={{ marginLeft: '1rem', padding: '0.5rem 1rem', fontSize: '0.8rem', background: role==='Judge'?'#f59e0b':role==='Visitor'?'#64748b':'#3b82f6' }}>
            Role: {role}
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
