import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

export default function Gallery() {
  const [selectedImg, setSelectedImg] = useState(null);

  const images = [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
      caption: "Cinta yang Bersemi"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
      caption: "Menggenggam Komitmen"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800",
      caption: "Kebahagiaan Bersama"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800",
      caption: "Langkah Baru"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800",
      caption: "Selamanya Bersatu"
    },
    {
      id: 6,
      url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=800",
      caption: "Detail Keindahan"
    }
  ];

  return (
    <section id="galeri" className="section-padding">
      <h2 className="cursive-title">Galeri Bahagia</h2>
      <p className="serif-subtitle">Kisah Kami Dalam Lensa</p>

      {/* Gallery Grid */}
      <div className="gallery-grid">
        {images.map((img) => (
          <div 
            key={img.id} 
            className="gallery-item"
            onClick={() => setSelectedImg(img.url)}
          >
            <img src={img.url} alt={img.caption} className="gallery-img" />
            <div className="gallery-hover-overlay">
              <Search size={28} className="gallery-hover-icon" />
              <p className="gallery-hover-caption">{img.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox / Modal */}
      {selectedImg && (
        <div className="lightbox" onClick={() => setSelectedImg(null)}>
          <button className="lightbox-close-btn" onClick={() => setSelectedImg(null)}>
            <X size={32} />
          </button>
          <img src={selectedImg} alt="Preview Foto Pernikahan" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <style jsx="true">{`
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 3rem;
        }

        .gallery-item {
          position: relative;
          aspect-ratio: 1 / 1;
          border-radius: 15px;
          overflow: hidden;
          cursor: zoom-in;
          box-shadow: 0 4px 15px rgba(108, 122, 113, 0.1);
          border: 1px solid var(--glass-border);
          transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s ease;
        }

        .gallery-item:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 12px 30px rgba(85, 107, 47, 0.2);
        }

        .gallery-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .gallery-item:hover .gallery-img {
          transform: scale(1.08);
        }

        .gallery-hover-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(44, 62, 53, 0.7);
          backdrop-filter: blur(3px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.4s ease;
          padding: 1rem;
          text-align: center;
        }

        .gallery-item:hover .gallery-hover-overlay {
          opacity: 1;
        }

        .gallery-hover-icon {
          color: var(--accent-gold);
          margin-bottom: 0.8rem;
          transform: translateY(10px);
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .gallery-item:hover .gallery-hover-icon {
          transform: translateY(0);
        }

        .gallery-hover-caption {
          font-family: var(--font-serif);
          color: white;
          font-size: 1.1rem;
          letter-spacing: 1px;
          transform: translateY(15px);
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.05s;
        }

        .gallery-item:hover .gallery-hover-caption {
          transform: translateY(0);
        }

        /* Lightbox Close Button */
        .lightbox-close-btn {
          position: absolute;
          top: 2rem;
          right: 2rem;
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .lightbox-close-btn:hover {
          transform: scale(1.1) rotate(90deg);
          color: var(--accent-gold);
        }

        @media (max-width: 900px) {
          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1.2rem;
          }
        }

        @media (max-width: 480px) {
          .gallery-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .gallery-hover-caption {
            font-size: 1rem;
          }
        }
      `}</style>
    </section>
  );
}
