import React, { useState, useEffect } from 'react';
import { Plus, Send, Eye, CheckCircle, XCircle, Trash2, Users, BarChart3 } from 'lucide-react';

export default function Dashboard() {
  const [guests, setGuests] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGuest, setNewGuest] = useState({ name: '', phone: '' });
  const [forwardingUrl, setForwardingUrl] = useState('');

  // Fetch guests and stats
  const fetchData = async () => {
    try {
      setLoading(true);
      const [guestsResponse, statsResponse] = await Promise.all([
        fetch('/api/guests'),
        fetch('/api/dashboard/stats')
      ]);

      if (guestsResponse.ok) {
        const guestsData = await guestsResponse.json();
        setGuests(guestsData);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }
    } catch (err) {
      setError('Gagal memuat data. Menggunakan data cadangan.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle adding new guest
  const handleAddGuest = async (e) => {
    e.preventDefault();
    if (!newGuest.name.trim()) return;

    try {
      const response = await fetch('/api/guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGuest)
      });

      if (response.ok) {
        const addedGuest = await response.json();
        setGuests([addedGuest, ...guests]);
        setNewGuest({ name: '', phone: '' });
        setShowAddForm(false);
        
        // Generate forwarding URL
        const forwardingUrl = `${window.location.origin}/?guest=${encodeURIComponent(addedGuest.slug)}`;
        setForwardingUrl(forwardingUrl);
      }
    } catch (err) {
      console.error('Error adding guest:', err);
      setError('Gagal menambahkan tamu');
    }
  };

  // Handle deleting guest
  const handleDeleteGuest = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus tamu ini?')) return;

    try {
      const response = await fetch(`/api/guests/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setGuests(guests.filter(guest => guest.id !== id));
      }
    } catch (err) {
      console.error('Error deleting guest:', err);
      setError('Gagal menghapus tamu');
    }
  };

  // Handle updating guest status
  const handleUpdateStatus = async (id, status) => {
    try {
      const extraFields = {};
      if (status === 'sent') extraFields.sent_at = new Date();
      if (status === 'opened') extraFields.opened_at = new Date();

      const response = await fetch(`/api/guests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...extraFields })
      });

      if (response.ok) {
        setGuests(guests.map(guest => 
          guest.id === id ? { ...guest, status } : guest
        ));
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Gagal memperbarui status tamu');
    }
  };

  // Copy URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(forwardingUrl);
    alert('URL telah disalin ke clipboard!');
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
      case 'pending': return <XCircle className="w-4 h-4" />;
      case 'sent': return <Send className="w-4 h-4" />;
      case 'opened': return <Eye className="w-4 h-4" />;
      case 'responded': return <CheckCircle className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard Manajemen Undangan</h1>
        <p>Kelola tamu undangan untuk pernikahan Salsa & Rian</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <Users className="w-8 h-8 text-blue-600" />
          <div className="stat-content">
            <h3>Total Tamu</h3>
            <p>{stats.totalGuests || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <Send className="w-8 h-8 text-green-600" />
          <div className="stat-content">
            <h3>Terkirim</h3>
            <p>{stats.sent || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <Eye className="w-8 h-8 text-yellow-600" />
          <div className="stat-content">
            <h3>Dibuka</h3>
            <p>{stats.opened || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <CheckCircle className="w-8 h-8 text-purple-600" />
          <div className="stat-content">
            <h3>Merespon</h3>
            <p>{stats.responded || 0}</p>
          </div>
        </div>
      </div>

      {/* Add Guest Form */}
      <div className="add-guest-section">
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          Tambah Tamu Baru
        </button>

        {showAddForm && (
          <div className="add-guest-form">
            <h3>Tambah Tamu Baru</h3>
            <form onSubmit={handleAddGuest}>
              <div className="form-group">
                <label>Nama Tamu *</label>
                <input
                  type="text"
                  value={newGuest.name}
                  onChange={(e) => setNewGuest({...newGuest, name: e.target.value})}
                  placeholder="Masukkan nama lengkap tamu"
                  required
                />
              </div>
              <div className="form-group">
                <label>Nomor Telepon</label>
                <input
                  type="tel"
                  value={newGuest.phone}
                  onChange={(e) => setNewGuest({...newGuest, phone: e.target.value})}
                  placeholder="Nomor telepon (opsional)"
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowAddForm(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-primary">
                  Tambah Tamu
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Forwarding URL Modal */}
      {forwardingUrl && (
        <div className="forwarding-modal">
          <div className="modal-content">
            <h3>Tamu Berhasil Ditambahkan!</h3>
            <p>URL undangan untuk tamu baru:</p>
            <div className="url-display">
              <input type="text" value={forwardingUrl} readOnly />
              <button onClick={copyToClipboard} className="btn-secondary">
                Salin URL
              </button>
            </div>
            <p className="modal-instruction">
              Kirim URL ini kepada tamu. Tamu dapat mengakses undangan mereka melalui link ini.
            </p>
            <button 
              onClick={() => setForwardingUrl('')}
              className="btn-close"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Guests List */}
      <div className="guests-section">
        <h2>Daftar Tamu</h2>
        {error && <div className="error-message">{error}</div>}
        
        {guests.length === 0 ? (
          <div className="no-guests">
            <p>Belum ada tamu yang ditambahkan.</p>
          </div>
        ) : (
          <div className="guests-table">
            <table>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Telepon</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((guest) => (
                  <tr key={guest.id}>
                    <td>
                      <div className="guest-name">
                        {guest.name}
                        {guest.slug && (
                          <code className="guest-slug">/{guest.slug}</code>
                        )}
                      </div>
                    </td>
                    <td>{guest.phone || '-'}</td>
                    <td>
                      <span className={`status-badge ${getStatusColor(guest.status)}`}>
                        {getStatusIcon(guest.status)}
                        {guest.status === 'pending' && 'Menunggu'}
                        {guest.status === 'sent' && 'Terkirim'}
                        {guest.status === 'opened' && 'Dibuka'}
                        {guest.status === 'responded' && 'Merespon'}
                      </span>
                    </td>
                    <td className="actions">
                      {guest.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateStatus(guest.id, 'sent')}
                          className="btn-icon btn-send"
                          title="Kirim Undangan"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                      {guest.status === 'sent' && (
                        <button
                          onClick={() => handleUpdateStatus(guest.id, 'opened')}
                          className="btn-icon btn-open"
                          title="Tandai Dibuka"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteGuest(guest.id)}
                        className="btn-icon btn-delete"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx="true">{`
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .dashboard-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .dashboard-header h1 {
          font-size: 2.5rem;
          color: #2c3e35;
          margin-bottom: 0.5rem;
        }

        .dashboard-header p {
          color: #666;
          font-size: 1.1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-content h3 {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 0.5rem;
        }

        .stat-content p {
          font-size: 2rem;
          font-weight: bold;
          color: #2c3e35;
        }

        .add-guest-section {
          margin-bottom: 3rem;
          text-align: center;
        }

        .btn-primary {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: background 0.2s;
        }

        .btn-primary:hover {
          background: #c0392b;
        }

        .add-guest-form {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          margin-top: 1.5rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .add-guest-form h3 {
          margin-bottom: 1.5rem;
          color: #2c3e35;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #333;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e1e8ed;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #e74c3c;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .form-actions button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
        }

        .form-actions button[type="button"] {
          background: #e1e8ed;
          color: #333;
        }

        .forwarding-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          text-align: center;
        }

        .modal-content h3 {
          color: #2c3e35;
          margin-bottom: 1rem;
        }

        .url-display {
          display: flex;
          gap: 0.5rem;
          margin: 1rem 0;
        }

        .url-display input {
          flex: 1;
          padding: 0.75rem;
          border: 2px solid #e1e8ed;
          border-radius: 8px;
        }

        .modal-instruction {
          color: #666;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        .btn-secondary {
          background: #3498db;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn-secondary:hover {
          background: #2980b9;
        }

        .btn-close {
          background: #e1e8ed;
          color: #333;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
        }

        .guests-section {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .guests-section h2 {
          color: #2c3e35;
          margin-bottom: 1.5rem;
        }

        .error-message {
          background: #fee;
          color: #c33;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .no-guests {
          text-align: center;
          padding: 3rem;
          color: #666;
        }

        .guests-table {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e1e8ed;
        }

        th {
          background: #f8f9fa;
          font-weight: 600;
          color: #333;
        }

        .guest-name {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .guest-slug {
          font-size: 0.8rem;
          color: #666;
          font-family: 'Courier New', monospace;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-icon {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .btn-icon:hover {
          background: #f0f0f0;
        }

        .btn-send:hover {
          background: #e8f5e8;
          color: #27ae60;
        }

        .btn-open:hover {
          background: #fff3cd;
          color: #f39c12;
        }

        .btn-delete:hover {
          background: #f8d7da;
          color: #e74c3c;
        }

        .loading {
          text-align: center;
          padding: 3rem;
          font-size: 1.2rem;
          color: #666;
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 1rem;
          }

          .dashboard-header h1 {
            font-size: 2rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .guests-table {
            font-size: 0.875rem;
          }

          .actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}