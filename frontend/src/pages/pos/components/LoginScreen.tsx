import { useState } from 'react';
import type { StaffCard } from '../../../types/pos.types';

interface Props {
  staff: StaffCard[];
  onLogin: (userId: string, pin: string) => Promise<void>;
  loginErrors: number;
}

const ROLE_COLORS: Record<string, string> = {
  owner: '#F59E0B',
  manager: '#E4540C',
  kasir: '#3B82F6',
};

export default function LoginScreen({ staff, onLogin, loginErrors }: Props) {
  const [selectedStaff, setSelectedStaff] = useState<StaffCard | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function getInitials(name: string) {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  async function handleKeyPress(key: string) {
    if (loading) return;
    if (key === 'del') {
      setPin(p => p.slice(0, -1));
      setError('');
      return;
    }
    if (pin.length >= 4) return;
    const newPin = pin + key;
    setPin(newPin);

    if (newPin.length === 4) {
      setLoading(true);
      setError('');
      try {
        await onLogin(selectedStaff!.id, newPin);
      } catch {
        setError(loginErrors >= 2 ? 'Akun terkunci 5 menit setelah 3x gagal' : 'PIN salah, coba lagi');
        setPin('');
      } finally {
        setLoading(false);
      }
    }
  }

  const keys = ['1','2','3','4','5','6','7','8','9','','0','del'];

  return (
    <div className="login-screen">
      {/* Branding */}
      <div className="login-brand">
        <span className="login-logo-icon">🔥</span>
        <div className="login-brand-name">NASHTY</div>
        <div className="login-brand-sub">POINT OF SALE</div>
      </div>

      {/* Staff selection */}
      {!selectedStaff ? (
        <>
          <p style={{ color: 'var(--txt3)', fontSize: '14px' }}>Pilih akun Anda</p>
          <div className="login-staff-grid">
            {staff.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--txt3)', fontSize: '14px' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚠️</div>
                <div>Server tidak tersedia</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>Pastikan backend berjalan di port 3001</div>
              </div>
            ) : staff.map(s => (
              <div
                key={s.id}
                className="staff-card"
                onClick={() => setSelectedStaff(s)}
              >
                <div className="staff-avatar" style={{ background: `${ROLE_COLORS[s.role]}18`, color: ROLE_COLORS[s.role] }}>
                  {getInitials(s.name.split('(')[0].trim())}
                </div>
                <div className="staff-name">{s.name.split('(')[0].trim()}</div>
                <span className={`badge badge-${s.role === 'kasir' ? 'blue' : s.role === 'manager' ? 'orange' : 'yellow'}`}>
                  {s.role}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* PIN entry */
        <div className="modal-box pin-modal">
          <button
            onClick={() => { setSelectedStaff(null); setPin(''); setError(''); }}
            style={{ position: 'absolute', top: '12px', left: '12px', background: 'none', border: 'none', color: 'var(--txt3)', cursor: 'pointer', fontSize: '16px' }}
          >
            ← Kembali
          </button>

          <div style={{ textAlign: 'center' }}>
            <div className="staff-avatar" style={{
              width: '56px', height: '56px', margin: '0 auto 8px',
              background: `${ROLE_COLORS[selectedStaff.role]}18`, color: ROLE_COLORS[selectedStaff.role],
              fontSize: '20px'
            }}>
              {getInitials(selectedStaff.name.split('(')[0].trim())}
            </div>
            <div style={{ fontSize: '16px', fontWeight: '700' }}>{selectedStaff.name.split('(')[0].trim()}</div>
            <div style={{ fontSize: '13px', color: 'var(--txt3)', marginTop: '2px' }}>Masukkan PIN 4 digit</div>
          </div>

          {/* PIN dots */}
          <div className="pin-display">
            {[0,1,2,3].map(i => (
              <div key={i} className={`pin-dot ${i < pin.length ? 'filled' : ''}`} />
            ))}
          </div>

          {/* Error */}
          <div className="pin-error">{error}</div>

          {/* Keypad */}
          <div className="pin-keypad">
            {keys.map((key, idx) => (
              key === '' ? (
                <div key={idx} className="keypad-btn empty" />
              ) : (
                <button
                  key={idx}
                  className={`keypad-btn ${key === 'del' ? 'del' : ''}`}
                  onClick={() => handleKeyPress(key)}
                  disabled={loading}
                >
                  {key === 'del' ? '⌫' : key}
                </button>
              )
            ))}
          </div>

          {loading && (
            <div style={{ textAlign: 'center', color: 'var(--txt3)', fontSize: '13px' }}>
              Memverifikasi...
            </div>
          )}
        </div>
      )}
    </div>
  );
}
