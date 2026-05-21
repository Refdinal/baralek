import React, { useEffect, useState } from 'react';
import { MailOpen } from 'lucide-react';

export default function Cover({ onOpen, isUnlocked }) {
  const [guestName, setGuestName] = useState('Tamu Undangan');

  useEffect(() => {
    // Ambil nama tamu dari parameter query URL (?to=Nama+Tamu)
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to');
    if (to) {
      setGuestName(to);
    }
  }, []);

  return (
    <div className={`cover-overlay ${isUnlocked ? 'fade-out' : ''}`}>
      <div className="cover-frame glass-card">
        <p className="cover-welcome">Walimatul 'Ursy</p>
        
        <h1 className="cover-names">Salsa & Rian</h1>
        
        <div className="gold-divider">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
          </svg>
        </div>

        <p className="cover-date">Minggu, 12 Desember 2026</p>

        <div className="guest-box">
          <p className="guest-label">Kepada Yth. Bapak/Ibu/Saudara/i:</p>
          <h2 className="guest-name">{guestName}</h2>
          <p className="guest-info">*Mohon maaf bila ada salah penulisan nama/gelar</p>
        </div>

        <button className="btn-gold btn-pulse" onClick={onOpen}>
          <MailOpen size={18} />
          Buka Undangan
        </button>
      </div>

      <style jsx="true">{`
        .cover-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: linear-gradient(135deg, #FAF7F0 0%, #E8DFCA 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
          transition: transform 1.2s cubic-bezier(0.85, 0, 0.15, 1), opacity 1s ease-in-out;
          padding: 1.5rem;
        }

        .cover-overlay.fade-out {
          transform: translateY(-100vh);
          opacity: 0;
          pointer-events: none;
        }

        .cover-frame {
          text-align: center;
          max-width: 480px;
          width: 100%;
          border: 2px solid var(--accent-gold);
          padding: 3rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(252, 251, 247, 0.9);
          position: relative;
        }

        .cover-frame::before {
          content: '';
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          bottom: 10px;
          border: 1px solid rgba(212, 175, 55, 0.4);
          pointer-events: none;
          border-radius: 12px;
        }

        .cover-welcome {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          letter-spacing: 3px;
          color: var(--text-light);
          text-transform: uppercase;
          margin-bottom: 1rem;
        }

        .cover-names {
          font-family: var(--font-cursive);
          font-size: 4rem;
          color: var(--accent-gold);
          margin: 0.5rem 0;
          line-height: 1.1;
        }

        .cover-date {
          font-family: var(--font-serif);
          font-size: 1rem;
          letter-spacing: 2px;
          color: var(--text-dark);
          margin-bottom: 2rem;
        }

        .guest-box {
          background: rgba(244, 240, 230, 0.8);
          border-radius: 15px;
          padding: 1.5rem;
          margin-bottom: 2.5rem;
          width: 100%;
          border: 1px dashed rgba(212, 175, 55, 0.3);
        }

        .guest-label {
          font-size: 0.85rem;
          color: var(--text-light);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .guest-name {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-dark);
          margin: 0.5rem 0;
        }

        .guest-info {
          font-size: 0.75rem;
          color: var(--text-light);
          font-style: italic;
        }

        .btn-pulse {
          animation: pulse-effect 2s infinite;
        }

        @keyframes pulse-effect {
          0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(212, 175, 55, 0); }
          100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
        }

        @media (max-width: 480px) {
          .cover-names {
            font-size: 3.2rem;
          }
          .cover-frame {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
