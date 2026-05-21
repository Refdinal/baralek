import React, { useState, useEffect } from 'react';
import { CheckCircle, Send, Eye } from 'lucide-react';

export default function GuestView() {
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rsvp, setRsvp] = useState(null);
  const [showRSVPForm, setShowRSVPForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    presence: '',
    guests_count: 1,
    wish: ''
  });

  // Get guest slug from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const guestSlug = urlParams.get('guest');
    
    if (guestSlug) {
      fetchGuestData(guestSlug);
    } else {
      setError('Tamu tidak ditemukan dalam undangan.');
      setLoading(false);
    }
  }, []);

  const fetchGuestData = async (slug) => {
    try {
      setLoading(true);
      
      // Fetch guest data
      const guestResponse = await fetch(`/api/guests/${slug}`);
      if (guestResponse.ok) {
        const guestData = await guestResponse.json();
        setGuest(guestData);
        
        // Auto-fill name in RSVP form
        setFormData(prev => ({ ...prev, name: guestData.name }));
        
        // Check if guest has already responded
        if (guestData.status === 'responded') {
          fetchRsvpData(guestData.id);
        }
      } else {
        setError('Tamu tidak ditemukan dalam undangan.');
      }
    } catch (err) {
      console.error('Error fetching guest data:', err);
      setError('Gagal memuat data tamu. Menggunakan data cadangan.');
      
      // Fallback to memory data
      const fallbackGuest = {
        id: 1,
        name: "Budi & Susi",
        phone: "6281234567890",
        slug: "budi-susi",
        status: "opened",
        created_at: new Date(Date.now() - 86400000 * 3),
        sent_at: new Date(Date.now() - 86400000 * 2),
        opened_at: new Date(Date.now() - 86400000),
      };
      setGuest(fallbackGuest);
      setFormData(prev => ({ ...prev, name: fallbackGuest.name }));
    } finally {
      setLoading(false);
    }
  };

  const fetchRsvpData = async (guestId) => {
    try {
      const rsvpsResponse = await fetch('/api/rsvps');
      if (rsvpsResponse.ok) {
        const rsvpsData = await rsvpsResponse.json();
        const guestRsvp = rsvpsData.find(r => r.guest_id === guestId);
        if (guestRsvp) {
          setRsvp(guestRsvp);
          setShowRSVPForm(false);
        }
      }
    } catch (err) {
      console.error('Error fetching RSVP data:', err);
    }
  };

  const handleRSVPSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.presence || !formData.wish) {
      alert('Mohon lengkapi status kehadiran dan ucapan Anda!');
      return;
    }

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_id: guest.id,
          ...formData
        })
      });

      if (response.ok) {
        const newRsvp = await response.json();
        setRsvp(newRsvp);
        setShowRSVPForm(false);
        
        // Update guest status to responded
        await fetch(`/api/guests/${guest.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'responded' })
        });
        
        setGuest(prev => ({ ...prev, status: 'responded' }));
      }
    } catch (err) {
      console.error('Error submitting RSVP:', err);
      alert('Gagal mengirim RSVP. Silakan coba lagi.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'opened': return 'bg-yellow-100 text-yellow-800';
      case 'responded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Send className="w-4 h-4" />;
      case 'sent': return <Send className="w-4 h-4" />;
      case 'opened': return <Eye className="w-4 h-4" />;
      case 'responded': return <CheckCircle className="w-4 h-4" />;
      default: return <Send className="w-4 h-4" />;
    }
  };

  const getPresenceText = (presence) => {
    return presence === 'Hadir' ? 'Hadir' : 'Berhalangan';
  };

  if (loading) {
    return (
      <div className="guest-container">
        <div className="loading">Memuat undangan...</div>
      </div>
    );
  }

  if (error && !guest) {
    return (
      <div className="guest-container">
        <div className="error">{error}</div>
        <button 
          onClick={() => window.location.href = '/'}
          className="btn-back"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="guest-container">
      {/* Header */}
      <div className="guest-header">
        <h1>Undangan Pernikahan</h1>
        <h2>Salsa & Rian</h2>
        <div className="status-badge">
          {getStatusIcon(guest.status)}
          <span>
            {guest.status === 'pending' && 'Menunggu Dikirim'}
            {guest.status === 'sent' && 'Terkirim'}
            {guest.status === 'opened' && 'Sudah Dibuka'}
            {guest.status === 'responded' && 'Sudah Merespon'}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="guest-content">
        <div className="invitation-info">
          <h3>Kepada Yth. {guest.name}</h3>
          <p>
            Dengan segala hormat, kami mengundang Anda untuk hadir dalam pernikahan kami.
            Kehadiran Anda merupakan kehormatan dan kebahagiaan bagi kami.
          </p>
        </div>

        {/* Event Details */}
        <div className="event-details">
          <h3>Detail Acara</h3>
          <div className="event-item">
            <strong>Akad Nikah:</strong><br />
            Sabtu, 25 Juli 2026<br />
            Pukul 08.00 - 10.00 WIB
          </div>
          <div className="event-item">
            <strong>Resepsi:</strong><br />
            Sabtu, 25 Juli 2026<br />
            Pukul 11.00 - 14.00 WIB
          </div>
          <div className="event-item">
            <strong>Tempat:</strong><br />
            Gedung Pernikahan Bahagia<br />
            Jl. Cinta No. 123, Jakarta Selatan
          </div>
        </div>

        {/* RSVP Section */}
        <div className="rsvp-section">
          <h3>Konfirmasi Kehadiran</h3>
          
          {rsvp ? (
            <div className="rsvp-confirmed">
              <CheckCircle className="w-12 h-12 text-green-600" />
              <h4>Terima kasih telah mengonfirmasi!</h4>
              <div className="rsvp-details">
                <p><strong>Nama:</strong> {rsvp.name}</p>
                <p><strong>Kehadiran:</strong> {getPresenceText(rsvp.presence)}</p>
                {rsvp.presence === 'Hadir' && (
                  <p><strong>Jumlah Tamu:</strong> {rsvp.guests_count} orang</p>
                )}
                <p><strong>Ucapan:</strong></p>
                <p className="wish-text">"{rsvp.wish}"</p>
              </div>
            </div>
          ) : (
            <div className="rsvp-form">
              <p>
                Mohon konfirmasi kehadiran Anda melalui form di bawah ini.
                Informasi ini sangat membantu kami dalam menyusun persiapan acara.
              </p>
              
              {showRSVPForm ? (
                <form onSubmit={handleRSVPSubmit} className="rsvp-form-fields">
                  <div className="form-group">
                    <label>Nama *</label>
                    <input
                      type="text"
                      value={formData.name}
                      readOnly
                      className="readonly-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Status Kehadiran *</label>
                    <select
                      value={formData.presence}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        presence: e.target.value,
                        guests_count: e.target.value === 'Hadir' ? (prev.guests_count || 1) : 0
                      }))}
                      required
                    >
                      <option value="">Pilih status</option>
                      <option value="Hadir">Hadir</option>
                      <option value="Berhalangan">Berhalangan</option>
                    </select>
                  </div>

                  {formData.presence === 'Hadir' && (
                    <div className="form-group">
                      <label>Jumlah Tamu</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={formData.guests_count}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          guests_count: parseInt(e.target.value) || 1 
                        }))}
                        required
                      />
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label>Ucapan & Doa Restu *</label>
                    <textarea
                      value={formData.wish}
                      onChange={(e) => setFormData(prev => ({ ...prev, wish: e.target.value }))}
                      placeholder="Tulis ucapan dan doa restu Anda..."
                      rows="4"
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      onClick={() => setShowRSVPForm(false)}
                      className="btn-secondary"
                    >
                      Batal
                    </button>
                    <button type="submit" className="btn-primary">
                      Kirim Konfirmasi
                    </button>
                  </div>
                </form>
              ) : (
                <button 
                  onClick={() => setShowRSVPForm(true)}
                  className="btn-rsvp"
                  disabled={guest.status === 'responded'}
                >
                  {guest.status === 'responded' ? 'Sudah Mengonfirmasi' : 'Konfirmasi Kehadiran'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="additional-info">
          <h3>Informasi Tambahan</h3>
          <ul>
            <li>Wajib membawa kartu identitas sebagai tanda kehadiran</li>
            <li>Untuk konfirmasi kehadiran, harap melalui form di atas</li>
            <li>Bagi yang berhalangan, doa restu Anda sangat kami harapkan</li>
            <li>Kontak: 0812-3456-7890 (Salsa)</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="guest-footer">
        <p>&copy; 2026 Salsa & Rian Wedding. All Rights Reserved.</p>
      </div>

      <style jsx="true">{`
        .guest-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .guest-header {
          text-align: center;
          padding: 3rem 1rem 2rem;
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
        }

        .guest-header h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          color: #fff;
        }

        .guest-header h2 {
          font-size: 1.8rem;
          margin-bottom: 1rem;
          color: #f8f9fa;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 25px;
          font-weight: 500;
        }

        .guest-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .invitation-info {
          text-align: center;
          margin-bottom: 3rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 2rem;
          border-radius: 15px;
          backdrop-filter: blur(10px);
        }

        .invitation-info h3 {
          font-size: 1.8rem;
          margin-bottom: 1rem;
          color: #fff;
        }

        .invitation-info p {
          font-size: 1.1rem;
          line-height: 1.6;
          opacity: 0.9;
        }

        .event-details {
          background: rgba(255, 255, 255, 0.1);
          padding: 2rem;
          border-radius: 15px;
          margin-bottom: 3rem;
          backdrop-filter: blur(10px);
        }

        .event-details h3 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: #fff;
        }

        .event-item {
          margin-bottom: 1rem;
          line-height: 1.6;
        }

        .rsvp-section {
          background: rgba(255, 255, 255, 0.1);
          padding: 2rem;
          border-radius: 15px;
          margin-bottom: 3rem;
          backdrop-filter: blur(10px);
        }

        .rsvp-section h3 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: #fff;
        }

        .rsvp-form p {
          margin-bottom: 1.5rem;
          line-height: 1.6;
          opacity: 0.9;
        }

        .btn-rsvp {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-rsvp:hover:not(:disabled) {
          background: #c0392b;
          transform: translateY(-2px);
        }

        .btn-rsvp:disabled {
          background: #95a5a6;
          cursor: not-allowed;
        }

        .rsvp-form-fields {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-weight: 500;
          color: #fff;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 0.75rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 1rem;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }

        .readonly-input {
          background: rgba(255, 255, 255, 0.2);
          cursor: not-allowed;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .btn-primary {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn-primary:hover {
          background: #c0392b;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .rsvp-confirmed {
          text-align: center;
          padding: 2rem;
        }

        .rsvp-confirmed h4 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: #fff;
        }

        .rsvp-details {
          background: rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          border-radius: 10px;
          text-align: left;
        }

        .rsvp-details p {
          margin-bottom: 0.75rem;
          line-height: 1.5;
        }

        .wish-text {
          font-style: italic;
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem;
          border-radius: 8px;
          margin-top: 0.5rem;
        }

        .additional-info {
          background: rgba(255, 255, 255, 0.1);
          padding: 2rem;
          border-radius: 15px;
          backdrop-filter: blur(10px);
        }

        .additional-info h3 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: #fff;
        }

        .additional-info ul {
          list-style: none;
          padding: 0;
        }

        .additional-info li {
          margin-bottom: 0.75rem;
          line-height: 1.6;
          position: relative;
          padding-left: 1.5rem;
        }

        .additional-info li::before {
          content: "•";
          position: absolute;
          left: 0;
          color: #e74c3c;
          font-weight: bold;
        }

        .guest-footer {
          text-align: center;
          padding: 2rem;
          background: rgba(0, 0, 0, 0.2);
          margin-top: 3rem;
        }

        .loading,
        .error {
          text-align: center;
          padding: 3rem;
          font-size: 1.2rem;
        }

        .error {
          color: #ff6b6b;
          background: rgba(255, 107, 107, 0.1);
          border-radius: 10px;
        }

        .btn-back {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 1rem;
        }

        .btn-back:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        @media (max-width: 768px) {
          .guest-header h1 {
            font-size: 2rem;
          }

          .guest-header h2 {
            font-size: 1.5rem;
          }

          .guest-content {
            padding: 1rem;
          }

          .invitation-info,
          .event-details,
          .rsvp-section,
          .additional-info {
            padding: 1.5rem;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}