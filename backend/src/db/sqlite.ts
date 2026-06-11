import Database from 'better-sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbDir = join(__dirname, '../../data');
const dbPath = join(dbDir, 'nashtypos.db');

if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable WAL mode for performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── Schema ──────────────────────────────────────────────────────────────────
db.exec(`
  CREATE TABLE IF NOT EXISTS outlets (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    logo_url TEXT,
    tax_rate REAL DEFAULT 0,
    tax_enabled INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    outlet_id TEXT REFERENCES outlets(id),
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('owner','manager','kasir','chef')),
    pin_hash TEXT NOT NULL,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS stations (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    outlet_id TEXT REFERENCES outlets(id),
    name TEXT NOT NULL,
    emoji TEXT,
    color TEXT,
    order_index INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1,
    warning_minutes INTEGER DEFAULT 8,
    critical_minutes INTEGER DEFAULT 15
  );

  CREATE TABLE IF NOT EXISTS menu_categories (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    outlet_id TEXT REFERENCES outlets(id),
    station_id TEXT REFERENCES stations(id),
    name TEXT NOT NULL,
    emoji TEXT,
    order_index INTEGER DEFAULT 0,
    is_active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    outlet_id TEXT REFERENCES outlets(id),
    category_id TEXT REFERENCES menu_categories(id),
    station_id TEXT REFERENCES stations(id),
    name TEXT NOT NULL,
    price REAL NOT NULL,
    emoji TEXT,
    photo_url TEXT,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS modifier_groups (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    outlet_id TEXT REFERENCES outlets(id),
    name TEXT NOT NULL,
    is_required INTEGER DEFAULT 0,
    min_select INTEGER DEFAULT 0,
    max_select INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS modifier_options (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    group_id TEXT REFERENCES modifier_groups(id),
    name TEXT NOT NULL,
    price_adjustment REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS menu_item_modifiers (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    menu_item_id TEXT REFERENCES menu_items(id),
    modifier_group_id TEXT REFERENCES modifier_groups(id)
  );

  CREATE TABLE IF NOT EXISTS shifts (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    outlet_id TEXT REFERENCES outlets(id),
    user_id TEXT REFERENCES users(id),
    started_at TEXT DEFAULT (datetime('now')),
    ended_at TEXT,
    opening_cash REAL DEFAULT 0,
    closing_cash REAL,
    status TEXT DEFAULT 'open' CHECK(status IN ('open','closed'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    outlet_id TEXT REFERENCES outlets(id),
    order_number TEXT UNIQUE,
    type TEXT NOT NULL CHECK(type IN ('dine_in','take_away','gofood','grabfood','shopee')),
    table_number TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending','preparing','ready','completed','cancelled','voided')),
    user_id TEXT REFERENCES users(id),
    shift_id TEXT REFERENCES shifts(id),
    subtotal REAL DEFAULT 0,
    discount_type TEXT,
    discount_value REAL DEFAULT 0,
    discount_amount REAL DEFAULT 0,
    tax_amount REAL DEFAULT 0,
    service_charge_amount REAL DEFAULT 0,
    total REAL DEFAULT 0,
    notes TEXT,
    void_reason TEXT,
    void_by TEXT REFERENCES users(id),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    platform_order_id TEXT
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    order_id TEXT REFERENCES orders(id),
    menu_item_id TEXT REFERENCES menu_items(id),
    name TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    item_status TEXT DEFAULT 'pending',
    station_id TEXT REFERENCES stations(id),
    notes TEXT
  );

  CREATE TABLE IF NOT EXISTS order_item_modifiers (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    order_item_id TEXT REFERENCES order_items(id),
    modifier_option_id TEXT REFERENCES modifier_options(id),
    name TEXT,
    price_adjustment REAL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS payments (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    order_id TEXT REFERENCES orders(id),
    method TEXT NOT NULL,
    amount REAL NOT NULL,
    change_amount REAL DEFAULT 0,
    platform_ref TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS service_charge_config (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    outlet_id TEXT UNIQUE REFERENCES outlets(id),
    rate REAL DEFAULT 0.05,
    is_enabled INTEGER DEFAULT 1,
    label TEXT DEFAULT 'Service Charge'
  );

  CREATE TABLE IF NOT EXISTS outlet_settings (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    outlet_id TEXT UNIQUE REFERENCES outlets(id),
    auto_logout_minutes INTEGER DEFAULT 30,
    max_discount_pct REAL DEFAULT 50,
    split_payment_enabled INTEGER DEFAULT 1,
    payment_methods_enabled TEXT DEFAULT '{"tunai":true,"transfer":true,"qris":true,"bca":true,"debit":true,"gofood":true,"grabfood":true,"shopee":true}'
  );
`);

export default db;
