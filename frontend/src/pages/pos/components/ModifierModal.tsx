import { useState } from 'react';
import type { MenuItem, CartModifier, ModifierGroup } from '../../../types/pos.types';

interface Props {
  item: MenuItem;
  onConfirm: (modifiers: CartModifier[], notes: string) => void;
  onClose: () => void;
}

function formatPrice(n: number) {
  if (n === 0) return 'Gratis';
  return (n > 0 ? '+' : '') + 'Rp ' + n.toLocaleString('id-ID');
}

export default function ModifierModal({ item, onConfirm, onClose }: Props) {
  // selectedOptions: { [groupId]: optionId[] }
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [notes, setNotes] = useState('');

  function toggleOption(group: ModifierGroup, optionId: string) {
    setSelected(prev => {
      const current = prev[group.id] || [];
      if (group.max_select === 1) {
        // Radio behavior
        return { ...prev, [group.id]: current.includes(optionId) ? [] : [optionId] };
      } else {
        // Checkbox behavior
        if (current.includes(optionId)) {
          return { ...prev, [group.id]: current.filter(id => id !== optionId) };
        } else if (current.length < group.max_select) {
          return { ...prev, [group.id]: [...current, optionId] };
        }
        return prev;
      }
    });
  }

  function isValid() {
    return item.modifier_groups.every(group => {
      if (!group.is_required) return true;
      return (selected[group.id] || []).length >= group.min_select;
    });
  }

  function buildModifiers(): CartModifier[] {
    const result: CartModifier[] = [];
    for (const group of item.modifier_groups) {
      const selectedIds = selected[group.id] || [];
      for (const optId of selectedIds) {
        const opt = group.options.find(o => o.id === optId);
        if (opt) {
          result.push({
            optionId: opt.id,
            groupId: group.id,
            groupName: group.name,
            name: opt.name,
            price_adjustment: opt.price_adjustment,
          });
        }
      }
    }
    return result;
  }

  function getModTotal() {
    let t = 0;
    for (const group of item.modifier_groups) {
      const selectedIds = selected[group.id] || [];
      for (const optId of selectedIds) {
        const opt = group.options.find(o => o.id === optId);
        if (opt) t += opt.price_adjustment;
      }
    }
    return t;
  }

  const total = item.price + getModTotal();

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-box modifier-modal">
        {/* Item header */}
        <div className="modifier-item-header">
          <div className="modifier-item-emoji">{item.emoji || '🍽️'}</div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '16px' }}>{item.name}</div>
            <div style={{ fontSize: '13px', color: 'var(--or)', fontFamily: 'var(--mo)', fontWeight: '600', marginTop: '2px' }}>
              Rp {item.price.toLocaleString('id-ID')}
            </div>
          </div>
        </div>

        <div className="divider" style={{ marginBottom: '16px' }} />

        {/* Modifier groups */}
        {item.modifier_groups.map(group => (
          <div key={group.id} className="modifier-group">
            <div className="modifier-group-title">
              {group.name}
              {group.is_required && (
                <span className="modifier-required-badge">WAJIB</span>
              )}
              {!group.is_required && (
                <span style={{ fontSize: '10px', color: 'var(--txt3)' }}>(Opsional)</span>
              )}
              {group.max_select > 1 && (
                <span style={{ fontSize: '10px', color: 'var(--txt3)' }}>
                  maks. {group.max_select}
                </span>
              )}
            </div>
            <div className="modifier-options">
              {group.options.map(opt => {
                const isSelected = (selected[group.id] || []).includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    className={`modifier-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleOption(group, opt.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '16px', height: '16px', borderRadius: group.max_select === 1 ? '50%' : '4px',
                        border: `2px solid ${isSelected ? 'var(--or)' : 'var(--brd2)'}`,
                        background: isSelected ? 'var(--or)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, transition: 'all 0.12s'
                      }}>
                        {isSelected && <span style={{ color: '#fff', fontSize: '10px' }}>✓</span>}
                      </div>
                      <span className="modifier-option-name">{opt.name}</span>
                    </div>
                    {opt.price_adjustment !== 0 && (
                      <span className="modifier-option-price">{formatPrice(opt.price_adjustment)}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div className="modifier-footer">
          <textarea
            className="modifier-notes"
            placeholder="Catatan khusus (opsional)..."
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '14px', color: 'var(--txt2)' }}>
              Total: <span style={{ fontFamily: 'var(--mo)', fontWeight: '700', color: 'var(--txt)', fontSize: '16px' }}>
                Rp {total.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="btn btn-ghost" style={{ flex: '0 0 auto', padding: '12px 20px' }} onClick={onClose}>
              Batal
            </button>
            <button
              className="btn btn-primary"
              style={{ flex: 1, padding: '12px' }}
              disabled={!isValid()}
              onClick={() => isValid() && onConfirm(buildModifiers(), notes)}
            >
              Tambah ke Cart
              {!isValid() && ' (Pilih varian wajib)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
