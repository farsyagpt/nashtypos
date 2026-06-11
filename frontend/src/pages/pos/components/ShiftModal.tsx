import { useState } from 'react';
import type { Shift } from '../../../types/pos.types';

interface Props {
  shift: Shift | null;
  onOpen: (openingCash: number) => void;
  onClose: () => void;
  onDismiss: () => void;
}

export default function ShiftModal({ shift, onOpen, onClose, onDismiss }: Props) {
  const [openingCash, setOpeningCash] = useState('');
  const [confirmClose, setConfirmClose] = useState(false);

  function formatDate(d: string) {
    return new Date(d).toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget && shift) onDismiss(); }}>
      <div className="modal-box shift-modal">
        {shift ? (
          /* ── Close shift ─────────────────────────── */
          <>
            <h2 style={{ marginBottom: '4px' }}>⏹ Tutup Shift</h2>
            <p style={{ color: 'var(--txt3)', fontSize: '13px', marginBottom: '16px' }}>
              Shift aktif akan ditutup dan semua transaksi akan direkap.
            </p>

            <div className="shift-modal-summary">
              <div className="shift-row">
                <span style={{ color: 'var(--txt2)' }}>Shift dibuka</span>
                <span style={{ fontWeight: '600' }}>{formatDate(shift.started_at)}</span>
              </div>
              <div className="shift-row">
                <span style={{ color: 'var(--txt2)' }}>Dibuka oleh</span>
                <span style={{ fontWeight: '600' }}>{(shift as any).user_name || '-'}</span>
              </div>
              <div className="shift-row">
                <span style={{ color: 'var(--txt2)' }}>Kas awal</span>
                <span style={{ fontWeight: '600', fontFamily: 'var(--mo)' }}>
                  Rp {shift.opening_cash?.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {!confirmClose ? (
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onDismiss}>
                  Batal
                </button>
                <button className="btn btn-danger" style={{ flex: 1 }} onClick={() => setConfirmClose(true)}>
                  Tutup Shift
                </button>
              </div>
            ) : (
              <>
                <p style={{ color: 'var(--rd)', fontSize: '14px', marginBottom: '12px', textAlign: 'center', fontWeight: '600' }}>
                  ⚠️ Yakin ingin menutup shift?
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setConfirmClose(false)}>
                    Tidak
                  </button>
                  <button className="btn btn-danger" style={{ flex: 1 }} onClick={onClose}>
                    Ya, Tutup Sekarang
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          /* ── Open shift ──────────────────────────── */
          <>
            <h2 style={{ marginBottom: '4px' }}>▶ Buka Shift</h2>
            <p style={{ color: 'var(--txt3)', fontSize: '13px', marginBottom: '20px' }}>
              Tidak ada shift aktif. Buka shift untuk memulai transaksi.
            </p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', color: 'var(--txt2)', marginBottom: '6px', display: 'block' }}>
                Kas Awal (opsional)
              </label>
              <input
                type="number"
                className="input"
                placeholder="0"
                value={openingCash}
                onChange={e => setOpeningCash(e.target.value)}
                style={{ textAlign: 'right', fontFamily: 'var(--mo)', fontSize: '18px' }}
              />
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: '15px' }}
              onClick={() => onOpen(parseFloat(openingCash) || 0)}
            >
              Mulai Shift Sekarang
            </button>
          </>
        )}
      </div>
    </div>
  );
}
