import React, { useState, useEffect } from 'react';
import Cover from './components/Cover';
import MusicPlayer from './components/MusicPlayer';
import Couple from './components/Couple';
import Event from './components/Event';
import Gallery from './components/Gallery';
import Gift from './components/Gift';
import RSVP from './components/RSVP';

// Falling Petals Animation Component
const PetalsBackground = () => {
  const [petals, setPetals] = useState([]);
  
  useEffect(() => {
    // Generate 15 random petals
    const items = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${10 + Math.random() * 8}s`,
      size: `${8 + Math.random() * 14}px`
    }));
    setPetals(items);
  }, []);

  return (
    <div className="falling-petals">
      {petals.map((p) => (
        <span
          key={p.id}
          className="petal"
          style={{
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
            width: p.size,
            height: p.size,
          }}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wishes, setWishes] = useState([]);
  const [loadingWishes, setLoadingWishes] = useState(true);

  // Ambil ucapan tamu dari API Express
  const fetchWishes = async () => {
    setLoadingWishes(true);
    try {
      const response = await fetch('/api/wishes');
      if (response.ok) {
        const data = await response.json();
        setWishes(data);
      } else {
        console.error('Gagal memuat ucapan tamu.');
      }
    } catch (err) {
      console.error('Error fetching wishes:', err);
    } finally {
      setLoadingWishes(false);
    }
  };

  useEffect(() => {
    // Kunci scroll halaman saat cover aktif
    document.body.classList.add('locked');
    
    // Ambil data ucapan awal
    fetchWishes();

    return () => {
      document.body.classList.remove('locked');
    };
  }, []);

  const handleOpen = () => {
    setIsUnlocked(true);
    setIsPlaying(true);
    document.body.classList.remove('locked');
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const onSubmitRSVP = async (formData) => {
    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Gagal mengirim RSVP');
      }

      // Refresh list ucapan langsung setelah submit berhasil
      await fetchWishes();
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <div className="app-container">
      {/* 1. Cover Overlay Screen */}
      <Cover onOpen={handleOpen} isUnlocked={isUnlocked} />

      {/* 2. Floating Music Player */}
      {isUnlocked && (
        <MusicPlayer isPlaying={isPlaying} togglePlay={togglePlay} />
      )}

      {/* 3. Floating Petals Effect (Only shows after unlocked) */}
      {isUnlocked && <PetalsBackground />}

      {/* 4. Main Invitation Content */}
      <div className={`main-content ${isUnlocked ? 'active' : ''}`}>
        
        {/* Header / Intro Hero */}
        <header className="hero-header">
          <div className="hero-content">
            <span className="hero-intro">Kami Mengundang Anda</span>
            <h1 className="hero-title">Pernikahan Salsa &amp; Rian</h1>
            <p className="hero-quote">"Dua jiwa dengan satu pikiran, dua hati yang berdetak sebagai satu."</p>
          </div>
        </header>

        {/* Sections */}
        <main>
          <Couple />
          <Event />
          <Gallery />
          <Gift />
          <RSVP 
            wishes={wishes} 
            onSubmitRSVP={onSubmitRSVP} 
            loadingWishes={loadingWishes} 
          />
        </main>

        {/* Footer */}
        <footer className="wedding-footer">
          <div className="footer-content">
            <h2 className="footer-title">Terima Kasih</h2>
            <p className="footer-sub">Merupakan kehormatan dan kebahagiaan bagi kami bila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu bagi kami.</p>
            <div className="gold-divider">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
              </svg>
            </div>
            <p className="footer-names">Salsa &amp; Rian</p>
            <p className="footer-copyright">&copy; 2026 Salsa &amp; Rian Wedding. All Rights Reserved.</p>
          </div>
        </footer>
      </div>

      <style jsx="true">{`
        .app-container {
          min-height: 100vh;
          width: 100%;
          position: relative;
        }

        .main-content {
          opacity: 0;
          transition: opacity 1.5s ease-in-out;
        }

        .main-content.active {
          opacity: 1;
        }

        /* Hero Header styling */
        .hero-header {
          height: 100vh;
          background: linear-gradient(rgba(44, 62, 53, 0.4), rgba(44, 62, 53, 0.6)), url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1600') no-repeat center center;
          background-size: cover;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 0 1.5rem;
        }

        .hero-content {
          max-width: 800px;
          color: white;
          animation: fade-in-up 2s ease;
        }

        .hero-intro {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          letter-spacing: 4px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 1.5rem;
          color: var(--accent-gold);
        }

        .hero-title {
          font-family: var(--font-cursive);
          font-size: 5rem;
          margin-bottom: 1.5rem;
          line-height: 1.2;
          color: #FCFBF7;
          text-shadow: 2px 2px 10px rgba(0,0,0,0.3);
        }

        .hero-quote {
          font-size: 1.05rem;
          font-style: italic;
          letter-spacing: 1px;
          opacity: 0.9;
        }

        /* Footer styling */
        .wedding-footer {
          background-color: var(--text-dark);
          color: white;
          padding: 5rem 1.5rem;
          text-align: center;
        }

        .footer-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .footer-title {
          font-family: var(--font-serif);
          font-size: 2.2rem;
          letter-spacing: 2px;
          margin-bottom: 1.5rem;
          color: var(--accent-gold);
        }

        .footer-sub {
          font-size: 0.95rem;
          line-height: 1.7;
          opacity: 0.85;
          margin-bottom: 2rem;
        }

        .footer-names {
          font-family: var(--font-cursive);
          font-size: 3.5rem;
          color: var(--accent-gold);
          margin-bottom: 2rem;
        }

        .footer-copyright {
          font-size: 0.75rem;
          opacity: 0.5;
          letter-spacing: 1px;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 2rem;
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 3.5rem;
          }
          .hero-intro {
            font-size: 1rem;
            letter-spacing: 2px;
          }
          .footer-names {
            font-size: 2.8rem;
          }
        }
      `}</style>
    </div>
  );
}
