import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

export default function Event() {
  const targetDate = new Date('2026-12-12T09:00:00+07:00'); // 12 Desember 2026 09:00 WIB
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false
  });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +targetDate - +new Date();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isOver: false
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Membuat URL Google Calendar
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent("Pernikahan Salsa & Rian");
    const dates = "20261212T020000Z/20261212T060000Z"; // UTC (09:00 WIB = 02:00 UTC)
    const details = encodeURIComponent("Menghadiri pernikahan Salsa & Rian di Masjid Agung Sunda Kelapa.");
    const location = encodeURIComponent("Masjid Agung Sunda Kelapa, Jakarta");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
  };

  return (
    <section id="acara" className="section-padding event-section">
      <div className="decor-leaf decor-leaf-left"></div>
      <div className="decor-leaf decor-leaf-right"></div>

      <h2 className="cursive-title">Informasi Acara</h2>
      <p className="serif-subtitle">Save The Date</p>

      {/* Countdown Timer */}
      <div className="countdown-container glass-card">
        {timeLeft.isOver ? (
          <h3 className="countdown-message">Acara Telah Berlangsung</h3>
        ) : (
          <div className="countdown-grid">
            <div className="countdown-box">
              <span className="countdown-number">{timeLeft.days}</span>
              <span className="countdown-label">Hari</span>
            </div>
            <div className="countdown-box">
              <span className="countdown-number">{timeLeft.hours}</span>
              <span className="countdown-label">Jam</span>
            </div>
            <div className="countdown-box">
              <span className="countdown-number">{timeLeft.minutes}</span>
              <span className="countdown-label">Menit</span>
            </div>
            <div className="countdown-box">
              <span className="countdown-number">{timeLeft.seconds}</span>
              <span className="countdown-label">Detik</span>
            </div>
          </div>
        )}
      </div>

      {/* Event Details Grid */}
      <div className="grid-2">
        {/* Akad Nikah */}
        <div className="event-card glass-card">
          <div className="event-header">
            <h3 className="event-title">Akad Nikah</h3>
            <div className="gold-divider">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
              </svg>
            </div>
          </div>

          <div className="event-body">
            <div className="event-info-item">
              <Calendar className="event-icon" size={20} />
              <div>
                <h4>Hari & Tanggal</h4>
                <p>Minggu, 12 Desember 2026</p>
              </div>
            </div>

            <div className="event-info-item">
              <Clock className="event-icon" size={20} />
              <div>
                <h4>Waktu</h4>
                <p>08:00 - 10:00 WIB</p>
              </div>
            </div>

            <div className="event-info-item">
              <MapPin className="event-icon" size={20} />
              <div>
                <h4>Tempat</h4>
                <p><strong>Masjid Agung Sunda Kelapa</strong><br />Jl. Taman Sunda Kelapa No.16, Menteng, Kec. Menteng, Kota Jakarta Pusat</p>
              </div>
            </div>
          </div>

          <div className="event-footer">
            <a 
              href="https://maps.app.goo.gl/9ZvxZ1C1bS74G6rU9" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-outline"
            >
              <MapPin size={16} />
              Lihat Peta Lokasi
            </a>
          </div>
        </div>

        {/* Resepsi Pernikahan */}
        <div className="event-card glass-card">
          <div className="event-header">
            <h3 className="event-title">Resepsi Pernikahan</h3>
            <div className="gold-divider">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="currentColor"/>
              </svg>
            </div>
          </div>

          <div className="event-body">
            <div className="event-info-item">
              <Calendar className="event-icon" size={20} />
              <div>
                <h4>Hari & Tanggal</h4>
                <p>Minggu, 12 Desember 2026</p>
              </div>
            </div>

            <div className="event-info-item">
              <Clock className="event-icon" size={20} />
              <div>
                <h4>Waktu</h4>
                <p>11:00 - 14:00 WIB</p>
              </div>
            </div>

            <div className="event-info-item">
              <MapPin className="event-icon" size={20} />
              <div>
                <h4>Tempat</h4>
                <p><strong>Aula Utama Sunda Kelapa</strong><br />Jl. Taman Sunda Kelapa No.16, Menteng, Kec. Menteng, Kota Jakarta Pusat</p>
              </div>
            </div>
          </div>

          <div className="event-footer">
            <a 
              href="https://maps.app.goo.gl/9ZvxZ1C1bS74G6rU9" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-outline"
            >
              <MapPin size={16} />
              Lihat Peta Lokasi
            </a>
          </div>
        </div>
      </div>

      <div className="calendar-button-wrapper">
        <a 
          href={getGoogleCalendarUrl()} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-gold"
        >
          <Calendar size={18} />
          Tambahkan Ke Kalender
        </a>
      </div>

      <style jsx="true">{`
        .event-section {
          background-color: var(--bg-secondary);
          border-top: 1px solid rgba(212, 175, 55, 0.1);
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
          overflow: hidden;
        }

        .countdown-container {
          max-width: 600px;
          margin: 0 auto 4rem auto;
          text-align: center;
          padding: 2rem;
          background: rgba(252, 251, 247, 0.95);
          border: 2px solid var(--accent-gold);
        }

        .countdown-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }

        .countdown-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.8rem;
          background: var(--bg-secondary);
          border-radius: 12px;
          border: 1px solid rgba(212, 175, 55, 0.2);
        }

        .countdown-number {
          font-family: var(--font-serif);
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--accent-gold);
          line-height: 1.2;
        }

        .countdown-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-light);
          font-weight: 500;
          margin-top: 0.2rem;
        }

        .countdown-message {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          color: var(--accent-gold);
        }

        .event-card {
          background: rgba(252, 251, 247, 0.9);
          padding: 3rem 2rem;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .event-title {
          font-family: var(--font-serif);
          font-size: 1.6rem;
          color: var(--text-dark);
          text-align: center;
          font-weight: 600;
        }

        .event-body {
          margin: 2rem 0;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .event-info-item {
          display: flex;
          gap: 1.2rem;
          align-items: flex-start;
        }

        .event-icon {
          color: var(--accent-gold);
          margin-top: 0.2rem;
          flex-shrink: 0;
        }

        .event-info-item h4 {
          font-family: var(--font-serif);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-dark);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.2rem;
        }

        .event-info-item p {
          font-size: 0.95rem;
          color: var(--text-light);
          line-height: 1.5;
        }

        .event-footer {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }

        .calendar-button-wrapper {
          display: flex;
          justify-content: center;
          margin-top: 4rem;
        }

        /* Decorative Vector Elements */
        .decor-leaf {
          position: absolute;
          width: 250px;
          height: 250px;
          background-size: contain;
          background-repeat: no-repeat;
          opacity: 0.05;
          pointer-events: none;
        }

        .decor-leaf-left {
          top: -50px;
          left: -50px;
          transform: rotate(45deg);
        }

        .decor-leaf-right {
          bottom: -50px;
          right: -50px;
          transform: rotate(-135deg);
        }

        @media (max-width: 600px) {
          .countdown-grid {
            gap: 0.5rem;
          }
          .countdown-number {
            font-size: 1.6rem;
          }
          .countdown-box {
            padding: 0.5rem;
          }
          .countdown-label {
            font-size: 0.65rem;
          }
          .event-card {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </section>
  );
}
