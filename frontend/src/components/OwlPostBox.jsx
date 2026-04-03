import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiConfig } from '../services/api';

const OwlPostBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [myTeam, setMyTeam] = useState(localStorage.getItem('my_owl_team') || '');
  const [tempTeamInput, setTempTeamInput] = useState('');
  const [owls, setOwls] = useState([]);

  const fetchMyOwls = async (team) => {
    if (!team) return;
    const data = await apiConfig.fetchOwls(team);
    setOwls(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
  };

  // Poll every 30s
  useEffect(() => {
    if (myTeam) {
      fetchMyOwls(myTeam);
      const interval = setInterval(() => fetchMyOwls(myTeam), 30000);
      return () => clearInterval(interval);
    }
  }, [myTeam]);

  const handleSetTeam = (e) => {
    e.preventDefault();
    if (!tempTeamInput.trim()) return;
    localStorage.setItem('my_owl_team', tempTeamInput.trim());
    setMyTeam(tempTeamInput.trim());
  };

  const handleClearTeam = () => {
    localStorage.removeItem('my_owl_team');
    setMyTeam('');
    setOwls([]);
  };

  const unreadCount = owls.filter(o => !o.is_read).length;

  const handleRead = async (owl) => {
    if (!owl.is_read) {
      await apiConfig.markOwlRead(owl.id);
      setOwls(owls.map(o => o.id === owl.id ? { ...o, is_read: true } : o));
    }
  };

  const handleDelete = async (e, owlId) => {
    e.stopPropagation();
    if (window.confirm("정말 이 편지를 소각하시겠습니까?")) {
      const res = await apiConfig.deleteOwl(owlId);
      if (res.success) {
        setOwls(owls.filter(o => o.id !== owlId));
      } else {
        alert("편지를 지우는 도중 마법적인 오류가 발생했습니다.");
      }
    }
  };

  const handleClearAll = async () => {
    if (owls.length === 0) return;
    if (window.confirm("모든 부엉이 편지를 일괄 소각하시겠습니까? 이 작업은 돌이킬 수 없습니다.")) {
      const res = await apiConfig.clearOwls(myTeam);
      if (res.success) {
        setOwls([]);
      } else {
        alert("편지를 일괄 삭제하는 도중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div 
        style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 999 }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(true)}
          style={{
            background: 'var(--bg-secondary)',
            border: '2px solid var(--border-color)',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            fontSize: '2rem',
            cursor: 'pointer',
            boxShadow: '4px 4px 0px rgba(0,0,0,1)',
            position: 'relative'
          }}
        >
          🦉
          {unreadCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              background: '#d91e18',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              border: '2px solid black'
            }}>
              {unreadCount}
            </span>
          )}
        </motion.button>
      </div>

      {/* Inbox Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.6)', zIndex: 1000,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ y: 50, rotateX: 20 }}
              animate={{ y: 0, rotateX: 0 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="glass-card"
              style={{
                width: '90%', maxWidth: '500px', maxHeight: '80vh',
                display: 'flex', flexDirection: 'column',
                background: 'var(--bg-primary)',
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.08\'/%3E%3C/svg%3E")',
                position: 'relative'
              }}
            >
              <button 
                onClick={() => setIsOpen(false)} 
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-primary)' }}
              >
                ✕
              </button>

              <h2 className="magical-serif" style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '1rem' }}>
                부엉이 우체국 📬
              </h2>

              {!myTeam ? (
                <form onSubmit={handleSetTeam} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '2rem 0' }}>
                  <p style={{ textAlign: 'center', fontSize: '0.9rem' }}>당신의 편지를 받을 이름이나 팀 코드를 입력하세요.</p>
                  <input 
                    required
                    placeholder="예: 해리포터, 코딩마법사팀..."
                    value={tempTeamInput}
                    onChange={e => setTempTeamInput(e.target.value)}
                    style={{ padding: '0.8rem', border: '2px dashed var(--border-color)', background: 'transparent', textAlign: 'center', fontSize: '1.1rem', fontFamily: 'var(--font-serif)' }}
                  />
                  <button type="submit" className="glow-button" style={{ padding: '0.8rem' }}>우체함 열쇠 등록</button>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    <span>수신자: <strong>{myTeam}</strong></span>
                    <div>
                      {owls.length > 0 && <button onClick={handleClearAll} style={{ background: 'transparent', border: '1px solid #d91e18', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '0.8rem', marginRight: '0.5rem', color: '#d91e18' }}>모두 비우기</button>}
                      <button onClick={handleClearTeam} style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}>로그아웃</button>
                    </div>
                  </div>
                  
                  <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {owls.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🪹</div>
                        도착한 우편이 없습니다.
                      </div>
                    ) : (
                      owls.map(owl => (
                        <div 
                          key={owl.id} 
                          onClick={() => handleRead(owl)}
                          style={{
                            padding: '1rem',
                            border: '1px solid var(--border-color)',
                            backgroundColor: owl.is_read ? 'transparent' : 'rgba(0,0,0,0.05)',
                            cursor: owl.is_read ? 'default' : 'pointer',
                            position: 'relative'
                          }}
                        >
                          {!owl.is_read && (
                            <span style={{ position: 'absolute', top: '10px', right: '10px', color: '#d91e18', fontSize: '0.8rem' }}>● New</span>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              보낸이: <strong style={{ color: 'var(--text-primary)' }}>{owl.from_name}</strong>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{new Date(owl.timestamp).toLocaleString()}</span>
                              <button 
                                onClick={(e) => handleDelete(e, owl.id)} 
                                style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6, padding: '0 0.2rem' }}
                                title="소각하기"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5', fontFamily: 'var(--font-serif)', fontSize: '0.95rem' }}>
                            {owl.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OwlPostBox;
