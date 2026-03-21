import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiConfig } from '../services/api';

const Section = ({ title, children, emoji }) => (
  <div className="glass-card" style={{ marginBottom: '2rem' }}>
    <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1.25rem' }}>
      {emoji} {title}
    </h3>
    <div style={{ padding: '0.5rem 0' }}>{children}</div>
  </div>
);

const HackathonDetail = () => {
  const { slug } = useParams();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock Form State
  const [submitNotes, setSubmitNotes] = useState('');

  useEffect(() => {
    apiConfig.fetchHackathonDetail(slug).then(data => {
      setDetail(data);
      setLoading(false);
    });
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await apiConfig.submitProject(slug, { teamCode: 'MyTeam', notes: submitNotes });
    alert('Mock Submission Saved! Leaderboard updated.');
    window.location.reload(); // Refresh to see local changes
  };

  if (loading) return <div className="loading">Loading Hackathon Detail...</div>;
  if (!detail) return <div className="error">Hackathon Detail not found. Ensure API is running.</div>;

  // Sometimes JSON is nested inside `sections`, extracting it carefully:
  const content = detail.sections || detail;

  return (
    <div style={{ marginTop: '1rem' }}>
      <Link to="/hackathons" style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'inline-block' }}>
        ← Back to Hackathons
      </Link>
      
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {detail.title || 'Hackathon Name'}
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
        <div className="left-column">
          {/* 1. Overview */}
          <Section title="Overview (안내/개요)" emoji="📌">
            <p>{content.overview?.summary || 'No overview provided.'}</p>
            <ul style={{ marginTop: '1rem', marginLeft: '1.5rem', color: 'var(--text-secondary)' }}>
              {content.info?.notice?.map((n, i) => <li key={i} style={{marginBottom: '0.5rem'}}>{n}</li>)}
            </ul>
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
            <p><strong>Metric:</strong> {content.eval?.metricName}</p>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>{content.eval?.description}</p>
          </Section>

          {/* 4. Prize */}
          <Section title="Prize (상금)" emoji="💰">
            {content.prize?.items ? (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                {content.prize.items.map((p, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center', background: 'var(--glass-border)', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--accent-primary)' }}>{p.place}</div>
                    <div>{p.amountKRW.toLocaleString()} KRW</div>
                  </div>
                ))}
              </div>
            ) : <p>Prize details not specified.</p>}
          </Section>

          {/* 5. Submit */}
          <Section title="Submit (제출)" emoji="🚀">
            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              {content.submit?.guide?.[0] || 'Submit your final artifact here.'}
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="Artifact URL (Mock)" style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
              <textarea 
                placeholder="Optional Notes..." 
                value={submitNotes} 
                onChange={e => setSubmitNotes(e.target.value)}
                style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)', color: 'white', minHeight: '80px' }} 
              />
              <button type="submit" className="glow-button">Submit to Dashboard</button>
            </form>
          </Section>
        </div>

        <div className="right-column">
          {/* 6. Teams / Camp */}
          <Section title="Teams (팀/캠프)" emoji="🤝">
            <p style={{ marginBottom: '1rem' }}>Join an existing team or recruit members for this hackathon.</p>
            <Link to={`/camp?hackathon=${slug}`} className="glow-button" style={{ display: 'block', textAlign: 'center', background: 'var(--glass-border)' }}>
              View Hackathon Camp
            </Link>
          </Section>

          {/* 7. Leaderboard */}
          <Section title="Leaderboard (리더보드)" emoji="🏆">
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <p style={{ marginBottom: '1rem' }}>Top teams submitting to this hackathon.</p>
              <Link to={`/rankings`} className="glow-button" style={{ display: 'block', textAlign: 'center', background: 'var(--glass-border)' }}>
                View Full Leaderboard
              </Link>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
};

export default HackathonDetail;
