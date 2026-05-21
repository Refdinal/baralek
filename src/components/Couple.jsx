import React from 'react';
import { Instagram } from 'lucide-react';

export default function Couple() {
  return (
    <section id="mempelai" className="section-padding">
      {/* Quranic Verse */}
      <div className="verse-container glass-card">
        <p className="verse-arabic">
          وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِقَوْمٍ يَتَفَكَّرُونَ
        </p>
        <p className="verse-translation">
          "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang. Sungguh, pada yang demikian itu benar-benar terdapat tanda-tanda (kebesaran-Nya) bagi kaum yang berpikir."
        </p>
        <p className="verse-ref">(QS. Ar-Rum: 21)</p>
      </div>

      <div className="gold-divider">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
        </svg>
      </div>

      {/* Mempelai Profiles Grid */}
      <div className="grid-2">
        {/* Bride Card */}
        <div className="couple-card glass-card">
          <div className="img-frame">
            <img src="/images/bride.png" alt="Salsabila Putri" className="couple-img" />
          </div>
          <h3 className="couple-nickname">Salsa</h3>
          <h4 className="couple-fullname">Salsabila Putri, S.Kom.</h4>
          <p className="parents-info">
            Putri pertama dari pasangan <br />
            <strong>Bpk. Ahmad Wijaya</strong> &amp; <strong>Ibu Ratna Wijaya</strong>
          </p>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="instagram-link"
          >
            <Instagram size={18} />
            @salsabila.putri
          </a>
        </div>

        {/* Groom Card */}
        <div className="couple-card glass-card">
          <div className="img-frame">
            <img src="/images/groom.png" alt="Rian Hidayat" className="couple-img" />
          </div>
          <h3 className="couple-nickname">Rian</h3>
          <h4 className="couple-fullname">Rian Hidayat, S.T.</h4>
          <p className="parents-info">
            Putra kedua dari pasangan <br />
            <strong>Bpk. Bambang Hidayat</strong> &amp; <strong>Ibu Sri Wahyuni</strong>
          </p>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="instagram-link"
          >
            <Instagram size={18} />
            @rian.hidayat
          </a>
        </div>
      </div>

      <style jsx="true">{`
        .verse-container {
          text-align: center;
          margin-bottom: 4rem;
          padding: 2.5rem;
          background: rgba(244, 240, 230, 0.5);
          border: 1px solid rgba(212, 175, 55, 0.15);
        }

        .verse-arabic {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          line-height: 2.2;
          color: var(--text-dark);
          margin-bottom: 1.5rem;
          direction: rtl;
        }

        .verse-translation {
          font-size: 0.95rem;
          color: var(--text-light);
          font-style: italic;
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }

        .verse-ref {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--accent-gold);
          text-transform: uppercase;
        }

        .couple-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 3rem 2rem;
          background: rgba(252, 251, 247, 0.8);
        }

        .img-frame {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          border: 3px solid var(--accent-gold);
          padding: 8px;
          margin-bottom: 2rem;
          box-shadow: 0 8px 24px rgba(85, 107, 47, 0.1);
          overflow: hidden;
          background: var(--bg-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .couple-img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .couple-card:hover .couple-img {
          transform: scale(1.08);
        }

        .couple-nickname {
          font-family: var(--font-cursive);
          font-size: 3rem;
          color: var(--accent-gold);
          margin-bottom: 0.5rem;
        }

        .couple-fullname {
          font-family: var(--font-serif);
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 1rem;
        }

        .parents-info {
          font-size: 0.95rem;
          color: var(--text-light);
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .instagram-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: var(--accent-green);
          font-weight: 500;
          transition: color 0.3s ease, transform 0.3s ease;
          border-bottom: 1px solid transparent;
        }

        .instagram-link:hover {
          color: var(--accent-gold);
          transform: translateY(-1px);
          border-bottom: 1px solid var(--accent-gold);
        }

        @media (max-width: 768px) {
          .verse-arabic {
            font-size: 1.2rem;
            line-height: 2;
          }
          .img-frame {
            width: 170px;
            height: 170px;
          }
        }
      `}</style>
    </section>
  );
}
