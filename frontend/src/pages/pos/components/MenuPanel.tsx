import { useState, useMemo } from 'react';
import type { MenuItem, MenuCategory } from '../../../types/pos.types';

interface Props {
  categories: MenuCategory[];
  items: MenuItem[];
  onItemSelect: (item: MenuItem) => void;
  shiftActive: boolean;
}

function formatPrice(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

export default function MenuPanel({ categories, items, onItemSelect, shiftActive }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(() => {
    let result = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(i => i.name.toLowerCase().includes(q));
    } else if (activeCategory) {
      result = result.filter(i => i.category_id === activeCategory);
    }
    return result;
  }, [items, activeCategory, search]);

  return (
    <div className="menu-panel">
      {/* Category Tabs */}
      <div className="cat-tabs-wrapper">
        <div className="cat-tabs">
          <button
            className={`cat-tab ${activeCategory === null && !search ? 'active' : ''}`}
            onClick={() => { setActiveCategory(null); setSearch(''); }}
          >
            ⭐ Semua
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`cat-tab ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => { setActiveCategory(cat.id); setSearch(''); }}
            >
              {cat.emoji && <span>{cat.emoji}</span>}
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="search-bar">
        <span className="search-bar-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Cari menu..."
          value={search}
          onChange={e => { setSearch(e.target.value); if (e.target.value) setActiveCategory(null); }}
        />
      </div>

      {/* Menu Grid */}
      <div className="menu-grid">
        {filteredItems.length === 0 ? (
          <div className="no-items">
            <div style={{ fontSize: '32px' }}>🍽️</div>
            <div>{search ? `Tidak ada menu "${search}"` : 'Tidak ada menu'}</div>
          </div>
        ) : filteredItems.map(item => (
          <div
            key={item.id}
            className={`product-card ${!shiftActive ? 'product-card-disabled' : ''}`}
            onClick={() => shiftActive && onItemSelect(item)}
          >
            <div className="product-card-img">
              {item.photo_url ? (
                <img src={item.photo_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span>{item.emoji || '🍽️'}</span>
              )}
            </div>
            <div className="product-card-body">
              <div className="product-card-name" title={item.name}>{item.name}</div>
              <div className="product-card-price">{formatPrice(item.price)}</div>
              {item.modifier_groups.some(g => g.is_required) && (
                <div style={{ fontSize: '10px', color: 'var(--txt3)', marginTop: '2px' }}>
                  Pilih varian →
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Shift not active notice */}
      {!shiftActive && items.length > 0 && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', borderRadius: '8px', pointerEvents: 'none'
        }}>
          <div style={{ textAlign: 'center', color: 'var(--txt2)' }}>
            <div style={{ fontSize: '32px' }}>🔒</div>
            <div style={{ fontSize: '14px', marginTop: '8px' }}>Buka shift untuk memulai</div>
          </div>
        </div>
      )}
    </div>
  );
}
