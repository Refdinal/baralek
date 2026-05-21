import React, { useState } from 'react';
import { Copy, Check, Gift as GiftIcon } from 'lucide-react';

export default function Gift() {
  const [copiedId, setCopiedId] = useState(null);

  const accounts = [
    {
      id: 'bca',
      bankName: 'Bank BCA',
      number: '1234567890',
      holder: 'SALSABILA PUTRI'
    },
    {
      id: 'mandiri',
      bankName: 'Bank Mandiri',
      number: '9876543210',
      holder: 'RIAN HIDAYAT'
    }
  ];

  const handleCopy = (number, id) => {
    navigator.clipboard.writeText(number).then(() => {
      setCopiedId(id);
      setTimeout(() => {
        setCopiedId(null);
      }, 2500);
    });
  };

  return (
    <section id="kado" className="section-padding gift-section">
      <h2 className="cursive-title">Kado Digital</h2>
      <p className="serif-subtitle">Tanda Kasih &amp; Restu Anda</p>
      
      <p className="gift-description">
        Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda ingin memberikan tanda kasih secara digital, Anda dapat mengirimkannya melalui rekening di bawah ini:
      </p>

      {/* Bank Cards Grid */}
      <div className="grid-2 accounts-grid">
        {accounts.map((acc) => (
          <div key={acc.id} className="bank-card glass-card">
            <div className="bank-logo-row">
              <span className="bank-title">{acc.bankName}</span>
              <GiftIcon size={24} className="bank-icon-decor" />
            </div>
            
            <div className="bank-card-body">
              <p className="acc-number-label">Nomor Rekening</p>
              <h3 className="acc-number">{acc.number}</h3>
              <p className="acc-holder">a.n. {acc.holder}</p>
            </div>

            <div className="bank-card-footer">
              <button 
                className={`btn-copy ${copiedId === acc.id ? 'copied' : ''}`}
                onClick={() => handleCopy(acc.number, acc.id)}
              >
                {copiedId === acc.id ? (
                  <>
                    <Check size={16} />
                    Berhasil Disalin!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Salin Rekening
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Toast Notification */}
      <div className={`toast-container ${copiedId ? 'show' : ''}`}>
        <Check size={18} className="toast-icon" />
        <span>Nomor rekening berhasil disalin!</span>
      </div>

      <style jsx="true">{`
        .gift-section {
          background-color: var(--bg-primary);
          text-align: center;
        }

        .gift-description {
          max-width: 600px;
          margin: 0 auto 3rem auto;
          color: var(--text-light);
          font-size: 0.95rem;
          line-height: 1.7;
        }

        .accounts-grid {
          max-width: 800px;
          margin: 0 auto;
        }

        .bank-card {
          background: linear-gradient(135deg, rgba(252, 251, 247, 0.9) 0%, rgba(244, 240, 230, 0.6) 100%);
          border: 1px solid var(--accent-gold);
          border-radius: 20px;
          padding: 2.5rem 2rem;
          text-align: left;
          position: relative;
          overflow: hidden;
        }

        .bank-card::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 120px;
          height: 120px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .bank-logo-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 1px solid rgba(212, 175, 55, 0.15);
          padding-bottom: 1rem;
        }

        .bank-title {
          font-family: var(--font-serif);
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-dark);
          letter-spacing: 0.5px;
        }

        .bank-icon-decor {
          color: var(--accent-gold);
          opacity: 0.8;
        }

        .bank-card-body {
          margin-bottom: 2rem;
        }

        .acc-number-label {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--text-light);
          margin-bottom: 0.4rem;
        }

        .acc-number {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-dark);
          letter-spacing: 1px;
          margin-bottom: 0.5rem;
        }

        .acc-holder {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-light);
        }

        .bank-card-footer {
          display: flex;
          justify-content: flex-end;
        }

        .btn-copy {
          background: transparent;
          border: 1px solid var(--accent-gold);
          color: var(--text-dark);
          padding: 0.6rem 1.4rem;
          font-weight: 500;
          border-radius: 50px;
          cursor: pointer;
          font-size: 0.85rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: var(--transition-smooth);
        }

        .btn-copy:hover {
          background: rgba(212, 175, 55, 0.1);
          transform: translateY(-2px);
        }

        .btn-copy.copied {
          background: var(--accent-green);
          border-color: var(--accent-green);
          color: white;
        }

        .toast-icon {
          color: var(--accent-gold);
        }
      `}</style>
    </section>
  );
}
