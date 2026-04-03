import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { apiConfig } from '../services/api';

const OwlSendModal = ({ isOpen, onClose, targetTeam }) => {
  const [senderStr, setSenderStr] = useState(localStorage.getItem('my_owl_team') || '');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [phase, setPhase] = useState('writing'); // 'writing' | 'stamping' | 'flying'

  // Remove unneeded render if closed
  if (!isOpen && phase === 'writing') return null;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!senderStr) return alert("보내는 이의 이름을 써주세요.");
    if (!message) return alert("내용을 작성해주세요.");

    setIsSending(true);
    const res = await apiConfig.sendOwl(targetTeam, senderStr, message);
    setIsSending(false);

    if (res.success) {
      setPhase('stamping');
      setTimeout(() => setPhase('flying'), 600);
      setTimeout(() => {
        onClose(); // Parent immediately unmounts
        setTimeout(() => {
          setPhase('writing'); // Clean up phase AFTER exit fade out concludes
          setMessage('');
        }, 500);
      }, 1600);
    } else {
      alert("부엉이가 길을 잃었습니다. 다시 시도해주세요.");
    }
  };

  const modalVariants = {
    writing: { scale: 1, y: 0, x: 0, rotate: 0, opacity: 1 },
    stamping: { scale: 0.95, y: 0, x: 0, rotate: 0, opacity: 1 }, // squish from stamp
    flying: { scale: 0.2, y: -800, x: 300, rotate: 25, opacity: 0, transition: { duration: 0.8, ease: "easeIn" } }
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      {(isOpen || phase !== 'writing') && (
        <motion.div
          key="dark-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onClick={phase === 'writing' ? onClose : undefined}
        >
          <motion.div
            key="parchment-modal"
            variants={modalVariants}
            initial="writing"
            animate={phase}
            exit={phase === 'writing' ? { scale: 0.9, y: 20, opacity: 0 } : { opacity: 0 }}
            onClick={e => e.stopPropagation()}
            style={{
              width: '90%', maxWidth: '400px',
              background: '#f4ecd8',
              color: '#2c2c2c',
              padding: '2rem',
              border: '2px solid #5a4b3c',
              boxShadow: '4px 4px 0px rgba(0,0,0,0.5)',
              position: 'relative'
            }}
          >
            {/* Wax Seal Layer (Only appears during stamping or flying) */}
            <AnimatePresence>
              {(phase === 'stamping' || phase === 'flying') && (
                <motion.div
                  key="wax-seal-stamp"
                  initial={{ scale: 5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  style={{
                    position: 'absolute', top: '50%', left: '50%', 
                    marginLeft: '-40px', marginTop: '-40px',
                    width: '80px', height: '80px', borderRadius: '50%', 
                    background: '#8B0000', border: '4px solid #500000',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5), 0 4px 4px rgba(0,0,0,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#e8dcc4', fontSize: '2.5rem', fontFamily: 'Cinzel, var(--font-serif)', fontStyle: 'italic', fontWeight: 'bold',
                    zIndex: 2000,
                    pointerEvents: 'none'
                  }}
                >
                  H
                </motion.div>
              )}
            </AnimatePresence>

            <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#5a4b3c', opacity: phase === 'writing' ? 1 : 0 }}>✕</button>
            <h3 className="magical-serif" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center', color: '#5a4b3c', borderBottom: '1px solid #5a4b3c', paddingBottom: '0.5rem' }}>
              부엉이 우편 쓰기
            </h3>
            
            <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', pointerEvents: phase === 'writing' ? 'auto' : 'none' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>To:</label>
                <div style={{ padding: '0.5rem', borderBottom: '1px dashed #5a4b3c', fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>
                  {targetTeam || 'Unknown'}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>From:</label>
                <input 
                  required
                  value={senderStr}
                  onChange={e => setSenderStr(e.target.value)}
                  placeholder="당신의 이름 또는 팀"
                  style={{ width: '100%', padding: '0.5rem', border: 'none', borderBottom: '1px dashed #5a4b3c', background: 'transparent', fontFamily: 'var(--font-serif)', fontSize: '1.1rem', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Message:</label>
                <textarea 
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="응원의 메시지, 통성명 등을 적어주세요..."
                  style={{ width: '100%', padding: '0.5rem', border: '1px dashed #5a4b3c', background: 'transparent', fontFamily: 'var(--font-serif)', fontSize: '1rem', minHeight: '120px', resize: 'none', boxSizing: 'border-box', marginTop: '0.5rem' }}
                />
              </div>

              <button type="submit" disabled={isSending || phase !== 'writing'} className="glow-button" style={{ background: '#5a4b3c', color: '#f4ecd8', border: 'none', marginTop: '1rem' }}>
                {isSending ? '준비 중...' : '부엉이 날리기 🦉'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default OwlSendModal;
