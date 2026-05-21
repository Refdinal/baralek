import React, { useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function MusicPlayer({ isPlaying, togglePlay }) {
  const audioRef = useRef(null);

  // Link musik romantis instrumen piano berkualitas tinggi
  const musicUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"; // Musik backup instrumental
  // Pilihan alternatif gratis yang sangat cocok untuk pernikahan:
  const weddingMusicUrl = "https://assets.mixkit.co/music/preview/mixkit-wedding-bells-slow-piano-1260.mp3";

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.log("Auto-play diblokir oleh browser, menunggu interaksi pengguna.", err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className="music-player-container">
      <audio 
        ref={audioRef} 
        src={weddingMusicUrl} 
        loop 
        preload="auto"
      />
      
      <button 
        className={`music-btn ${isPlaying ? 'spinning' : ''}`} 
        onClick={togglePlay}
        title={isPlaying ? "Matikan Musik" : "Putar Musik"}
      >
        {isPlaying ? <Volume2 size={22} /> : <VolumeX size={22} />}
      </button>

      <style jsx="true">{`
        .music-player-container {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 998;
        }

        .music-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-hover) 100%);
          border: 2px solid var(--bg-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(85, 107, 47, 0.3);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .music-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(85, 107, 47, 0.5);
        }

        .music-btn.spinning {
          animation: rotate-music 4s linear infinite;
        }

        @keyframes rotate-music {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 480px) {
          .music-player-container {
            bottom: 1.5rem;
            right: 1.5rem;
          }
          .music-btn {
            width: 44px;
            height: 44px;
          }
        }
      `}</style>
    </div>
  );
}
