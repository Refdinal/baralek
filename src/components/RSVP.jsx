import React, { useState } from 'react';
import { Send, Users, CheckCircle, XCircle } from 'lucide-react';

export default function RSVP({ wishes, onSubmitRSVP, loadingWishes }) {
  const [formData, setFormData] = useState({
    name: '',
    presence: 'Hadir',
    guests: '1',
    wish: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.wish.trim()) {
      setSubmitError('Mohon isi Nama dan Ucapan Anda!');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await onSubmitRSVP(formData);
      setSubmitSuccess(true);
      // Reset form kecuali nama jika ingin kirim lagi
      setFormData({
        name: '',
        presence: 'Hadir',
        guests: '1',
        wish: ''
      });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      setSubmitError('Gagal mengirim ucapan. Silakan coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper formatting waktu relatif (Indonesian)
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays === 1) return 'Kemarin';
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <section id="rsvp" className="section-padding rsvp-section">
      <h2 className="cursive-title">Konfirmasi &amp; Ucapan</h2>
      <p className="serif-subtitle">RSVP &amp; Guest Book</p>

      <div className="grid-2 rsvp-grid">
        {/* RSVP Form Card */}
        <div className="rsvp-card glass-card">
          <h3 className="card-title">Konfirmasi Kehadiran</h3>
          <p className="card-desc">Mohon konfirmasikan kehadiran Anda pada form di bawah ini:</p>

          <form onSubmit={handleSubmit} className="rsvp-form">
            {submitSuccess && (
              <div className="alert alert-success">
                <CheckCircle size={18} />
                <span>Terima kasih! Konfirmasi &amp; Ucapan Anda telah terkirim.</span>
              </div>
            )}

            {submitError && (
              <div className="alert alert-error">
                <XCircle size={18} />
                <span>{submitError}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Nama Lengkap</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="Nama Anda"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="presence">Konfirmasi Kehadiran</label>
              <select 
                id="presence" 
                name="presence"
                value={formData.presence}
                onChange={handleChange}
              >
                <option value="Hadir">Hadir</option>
                <option value="Berhalangan">Berhalangan</option>
              </select>
            </div>

            {formData.presence === 'Hadir' && (
              <div className="form-group">
                <label htmlFor="guests">Jumlah Tamu</label>
                <div className="select-guests-wrapper">
                  <Users size={16} className="guests-icon" />
                  <select 
                    id="guests" 
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                  >
                    <option value="1">1 Orang</option>
                    <option value="2">2 Orang</option>
                    <option value="3">3 Orang</option>
                  </select>
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="wish">Ucapan &amp; Doa Restu</label>
              <textarea 
                id="wish" 
                name="wish" 
                rows="4" 
                placeholder="Tulis ucapan dan doa terbaik Anda untuk Salsa & Rian..."
                value={formData.wish}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="btn-gold btn-submit"
              disabled={isSubmitting}
            >
              <Send size={16} />
              {isSubmitting ? 'Mengirim...' : 'Kirim Ucapan'}
            </button>
          </form>
        </div>

        {/* Guestbook Wishes List Card */}
        <div className="rsvp-card glass-card guestbook-card">
          <h3 className="card-title">Buku Tamu ({wishes.length})</h3>
          <p className="card-desc">Ucapan doa restu dari para tamu undangan:</p>

          <div className="wishes-list">
            {loadingWishes ? (
              <div className="loading-spinner-wrapper">
                <div className="spinner"></div>
                <p>Memuat ucapan...</p>
              </div>
            ) : wishes.length === 0 ? (
              <p className="no-wishes">Belum ada ucapan. Jadilah yang pertama memberikan doa!</p>
            ) : (
              wishes.map((wish) => (
                <div key={wish._id || Math.random().toString()} className="wish-item">
                  <div className="wish-header">
                    <span className="wish-name">{wish.name}</span>
                    <span className={`presence-badge ${wish.presence === 'Hadir' ? 'badge-hadir' : 'badge-absen'}`}>
                      {wish.presence === 'Hadir' ? `Hadir (${wish.guests} Org)` : 'Berhalangan'}
                    </span>
                  </div>
                  <p className="wish-time">{formatTime(wish.createdAt)}</p>
                  <p className="wish-text">{wish.wish}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .rsvp-section {
          background-color: var(--bg-secondary);
          border-top: 1px solid rgba(212, 175, 55, 0.1);
        }

        .rsvp-grid {
          align-items: start;
          max-width: 1000px;
          margin: 0 auto;
        }

        .rsvp-card {
          background: rgba(252, 251, 247, 0.95);
          padding: 2.5rem 2rem;
          height: 100%;
        }

        .card-title {
          font-family: var(--font-serif);
          font-size: 1.4rem;
          color: var(--text-dark);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .card-desc {
          font-size: 0.9rem;
          color: var(--text-light);
          margin-bottom: 2rem;
        }

        .rsvp-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          text-align: left;
        }

        .form-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-dark);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-group input, 
        .form-group select, 
        .form-group textarea {
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          background: white;
          color: var(--text-dark);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }

        .form-group input:focus, 
        .form-group select:focus, 
        .form-group textarea:focus {
          border-color: var(--accent-gold);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.15);
        }

        .select-guests-wrapper {
          position: relative;
        }

        .select-guests-wrapper select {
          width: 100%;
          padding-left: 2.5rem;
        }

        .guests-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
        }

        .btn-submit {
          margin-top: 1rem;
          width: 100%;
        }

        /* Wishes List */
        .guestbook-card {
          display: flex;
          flex-direction: column;
          max-height: 520px;
        }

        .wishes-list {
          flex-grow: 1;
          overflow-y: auto;
          padding-right: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          text-align: left;
        }

        .wish-item {
          background: var(--bg-primary);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 12px;
          padding: 1.2rem;
          position: relative;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }

        .wish-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.4rem;
          gap: 0.5rem;
        }

        .wish-name {
          font-family: var(--font-serif);
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-dark);
        }

        .presence-badge {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 0.2rem 0.6rem;
          border-radius: 50px;
          text-transform: uppercase;
        }

        .badge-hadir {
          background: rgba(85, 107, 47, 0.1);
          color: var(--accent-green);
        }

        .badge-absen {
          background: rgba(220, 53, 69, 0.08);
          color: #dc3545;
        }

        .wish-time {
          font-size: 0.75rem;
          color: var(--text-light);
          margin-bottom: 0.6rem;
        }

        .wish-text {
          font-size: 0.9rem;
          color: var(--text-dark);
          line-height: 1.5;
          word-break: break-word;
        }

        .no-wishes {
          text-align: center;
          color: var(--text-light);
          font-style: italic;
          margin-top: 3rem;
        }

        /* Alerts */
        .alert {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.8rem 1.2rem;
          border-radius: 8px;
          font-size: 0.85rem;
          line-height: 1.4;
          text-align: left;
        }

        .alert-success {
          background: rgba(85, 107, 47, 0.1);
          color: var(--accent-green);
          border: 1px solid rgba(85, 107, 47, 0.2);
        }

        .alert-error {
          background: rgba(220, 53, 69, 0.08);
          color: #dc3545;
          border: 1px solid rgba(220, 53, 69, 0.2);
        }

        /* Loading Spinner */
        .loading-spinner-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-top: 4rem;
          gap: 1rem;
          color: var(--text-light);
          font-size: 0.9rem;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(212, 175, 55, 0.15);
          border-top-color: var(--accent-gold);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 600px) {
          .rsvp-card {
            padding: 2rem 1.2rem;
          }
        }
      `}</style>
    </section>
  );
}
