-- Semua tabel menggunakan UUID sebagai primary key (gen_random_uuid())
-- Kolom outlet_id sebagai scope multi-outlet di sebagian besar tabel

-- Core
CREATE TABLE outlets ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text, address text, phone text, logo_url text, tax_rate numeric, tax_enabled boolean, is_active boolean, operating_hours jsonb, created_at timestamp with time zone DEFAULT now() );
CREATE TABLE users ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), outlet_id uuid REFERENCES outlets(id), email text, name text, role text, pin_hash text, is_active boolean, created_at timestamp with time zone DEFAULT now() );
-- role: 'owner' | 'manager' | 'kasir' | 'chef'

-- Menu
CREATE TABLE stations ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), outlet_id uuid REFERENCES outlets(id), name text, emoji text, color text, order_index int, is_active boolean, warning_minutes int, critical_minutes int );
CREATE TABLE menu_categories ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), outlet_id uuid REFERENCES outlets(id), station_id uuid REFERENCES stations(id), name text, emoji text, order_index int, is_active boolean );
CREATE TABLE menu_items ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), outlet_id uuid REFERENCES outlets(id), category_id uuid REFERENCES menu_categories(id), station_id uuid REFERENCES stations(id), name text, price numeric, emoji text, photo_url text, is_active boolean, created_at timestamp with time zone DEFAULT now() );
CREATE TABLE modifier_groups ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), outlet_id uuid REFERENCES outlets(id), name text, is_required boolean, min_select int, max_select int );
CREATE TABLE modifier_options ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), group_id uuid REFERENCES modifier_groups(id), name text, price_adjustment numeric );
CREATE TABLE menu_item_modifiers ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), menu_item_id uuid REFERENCES menu_items(id), modifier_group_id uuid REFERENCES modifier_groups(id) );
CREATE TABLE ingredients ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), outlet_id uuid REFERENCES outlets(id), name text, unit text, stock_current numeric, stock_minimum numeric );
CREATE TABLE menu_item_ingredients ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), menu_item_id uuid REFERENCES menu_items(id), ingredient_id uuid REFERENCES ingredients(id), quantity_used numeric );

-- Operasional
CREATE TABLE shifts ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), outlet_id uuid REFERENCES outlets(id), user_id uuid REFERENCES users(id), started_at timestamp with time zone, ended_at timestamp with time zone, opening_cash numeric, closing_cash numeric, counted_cash numeric, status text );
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), outlet_id uuid REFERENCES outlets(id), order_number text UNIQUE,
  type text,  -- 'dine_in' | 'take_away' | 'gofood' | 'grabfood' | 'shopee'
  table_number text, status text, customer_id uuid, user_id uuid REFERENCES users(id), shift_id uuid REFERENCES shifts(id),
  subtotal numeric, discount_type text, discount_value numeric, discount_amount numeric,
  tax_amount numeric, service_charge_amount numeric, total numeric, notes text,
  created_at timestamp with time zone DEFAULT now(), updated_at timestamp with time zone DEFAULT now(), kds_received_at timestamp with time zone, ready_at timestamp with time zone, served_at timestamp with time zone
);
CREATE TABLE order_items ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid REFERENCES orders(id), menu_item_id uuid REFERENCES menu_items(id), name text, price numeric, quantity int, item_status text, station_id uuid REFERENCES stations(id) );
CREATE TABLE order_item_modifiers ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_item_id uuid REFERENCES order_items(id), modifier_option_id uuid REFERENCES modifier_options(id), name text, price_adjustment numeric );
CREATE TABLE payments ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), order_id uuid REFERENCES orders(id), method text, amount numeric, change_amount numeric, created_at timestamp with time zone DEFAULT now() );

-- Konfigurasi
CREATE TABLE kds_settings ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), outlet_id uuid REFERENCES outlets(id) UNIQUE, warning_minutes int, critical_minutes int, compact_threshold int, layout_default text, font_scale numeric, card_width numeric, sound_alert boolean, flash_alert boolean, day_mode boolean, auto_sort boolean, show_cashier boolean, show_table boolean, show_notes boolean, show_station_badge boolean );
CREATE TABLE service_charge_config ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), outlet_id uuid REFERENCES outlets(id) UNIQUE, rate numeric, is_enabled boolean, label text );
CREATE TABLE outlet_settings ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), outlet_id uuid REFERENCES outlets(id) UNIQUE, auto_logout_minutes int, max_discount_pct numeric, split_payment_enabled boolean, payment_methods_enabled jsonb );

-- CRM / Loyalitas
CREATE TABLE segment_tiers ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), outlet_id uuid REFERENCES outlets(id), name text, color text, min_visits int, order_index int );
CREATE TABLE customers ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), outlet_id uuid REFERENCES outlets(id), name text, phone text, segment_tier_id uuid REFERENCES segment_tiers(id), visit_count int, total_spend numeric, points_balance int, total_points_earned int, total_points_redeemed int, last_visit_at timestamp with time zone, created_at timestamp with time zone DEFAULT now() );
ALTER TABLE orders ADD CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers(id);

CREATE TABLE reward_programs ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), outlet_id uuid REFERENCES outlets(id), name text, description text, points_required int, quota int, is_active boolean, expires_at timestamp with time zone, created_at timestamp with time zone DEFAULT now() );
CREATE TABLE reward_redemptions ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), customer_id uuid REFERENCES customers(id), reward_program_id uuid REFERENCES reward_programs(id), order_id uuid REFERENCES orders(id), points_used int, redeemed_at timestamp with time zone DEFAULT now() );
CREATE TABLE customer_points_history ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), customer_id uuid REFERENCES customers(id), order_id uuid REFERENCES orders(id), type text, points int, balance_after int, created_at timestamp with time zone DEFAULT now() );

-- Audit & Sesi
CREATE TABLE activity_logs ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), outlet_id uuid REFERENCES outlets(id), user_id uuid REFERENCES users(id), action_type text, entity_type text, entity_id text, details jsonb, created_at timestamp with time zone DEFAULT now() );
CREATE TABLE pos_sessions ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), outlet_id uuid REFERENCES outlets(id), user_id uuid REFERENCES users(id), device_id text, login_at timestamp with time zone, logout_at timestamp with time zone, auto_logout boolean );
CREATE TABLE sync_queue ( id uuid PRIMARY KEY DEFAULT gen_random_uuid(), device_id text, type text, payload jsonb, created_at timestamp with time zone DEFAULT now(), synced_at timestamp with time zone, status text );

-- RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
-- Note: Further RLS policies should be added here as specified in design.md
