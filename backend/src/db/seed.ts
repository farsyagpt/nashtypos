import db from './sqlite.js';
import bcrypt from 'bcryptjs';

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export async function seedDatabase() {
  // Cek apakah sudah ada data
  const existing = db.prepare('SELECT id FROM outlets LIMIT 1').get();
  if (existing) {
    console.log('✅ Database sudah ter-seed, skip seeding.');
    return;
  }

  console.log('🌱 Seeding database...');

  const outletId = uuidv4();
  const stationGrilId = uuidv4();
  const stationBarId = uuidv4();
  const catChickenId = uuidv4();
  const catDrinksId = uuidv4();
  const catSidesId = uuidv4();
  const catSnacksId = uuidv4();

  // Outlet
  db.prepare(`INSERT INTO outlets (id, name, address, phone, tax_rate, tax_enabled, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .run(outletId, 'Nashty Hot Chicken', 'Jl. Sultan Iskandar Muda No. 1, Jakarta', '021-5555-1234', 0.11, 0, 1);

  // Service charge config
  db.prepare(`INSERT INTO service_charge_config (id, outlet_id, rate, is_enabled, label) VALUES (?, ?, ?, ?, ?)`)
    .run(uuidv4(), outletId, 0.05, 1, 'Service Charge');

  // Outlet settings
  db.prepare(`INSERT INTO outlet_settings (id, outlet_id, auto_logout_minutes, max_discount_pct) VALUES (?, ?, ?, ?)`)
    .run(uuidv4(), outletId, 30, 50);

  // Users
  const pin1234Hash = bcrypt.hashSync('1234', 10);
  const pin9999Hash = bcrypt.hashSync('9999', 10);
  const pin0000Hash = bcrypt.hashSync('0000', 10);
  const pin5678Hash = bcrypt.hashSync('5678', 10);

  const users = [
    { id: uuidv4(), name: 'Reza (Owner)', role: 'owner', pin_hash: pin9999Hash },
    { id: uuidv4(), name: 'Budi (Manager)', role: 'manager', pin_hash: pin0000Hash },
    { id: uuidv4(), name: 'Sari (Kasir)', role: 'kasir', pin_hash: pin1234Hash },
    { id: uuidv4(), name: 'Andi (Kasir)', role: 'kasir', pin_hash: pin5678Hash },
  ];

  const insertUser = db.prepare(`INSERT INTO users (id, outlet_id, name, role, pin_hash, is_active) VALUES (?, ?, ?, ?, ?, ?)`);
  for (const u of users) {
    insertUser.run(u.id, outletId, u.name, u.role, u.pin_hash, 1);
  }

  // Stations
  db.prepare(`INSERT INTO stations (id, outlet_id, name, emoji, color, order_index, warning_minutes, critical_minutes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(stationGrilId, outletId, 'Grill', '🔥', '#E4540C', 0, 8, 15);
  db.prepare(`INSERT INTO stations (id, outlet_id, name, emoji, color, order_index, warning_minutes, critical_minutes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(stationBarId, outletId, 'Bar', '🧃', '#3B82F6', 1, 3, 6);

  // Categories
  const insertCat = db.prepare(`INSERT INTO menu_categories (id, outlet_id, station_id, name, emoji, order_index) VALUES (?, ?, ?, ?, ?, ?)`);
  insertCat.run(catChickenId, outletId, stationGrilId, 'Chicken', '🍗', 0);
  insertCat.run(catSidesId, outletId, stationGrilId, 'Sides', '🍟', 1);
  insertCat.run(catSnacksId, outletId, stationGrilId, 'Snacks', '🧆', 2);
  insertCat.run(catDrinksId, outletId, stationBarId, 'Drinks', '🥤', 3);

  // Menu items
  const items = [
    // Chicken
    { id: uuidv4(), cat: catChickenId, st: stationGrilId, name: 'Nashty Classic', price: 45000, emoji: '🍗' },
    { id: uuidv4(), cat: catChickenId, st: stationGrilId, name: 'Nashty Spicy', price: 47000, emoji: '🌶️' },
    { id: uuidv4(), cat: catChickenId, st: stationGrilId, name: 'Nashty Crispy', price: 45000, emoji: '🍗' },
    { id: uuidv4(), cat: catChickenId, st: stationGrilId, name: 'Nashty Sandwich', price: 42000, emoji: '🥪' },
    { id: uuidv4(), cat: catChickenId, st: stationGrilId, name: 'Nashty Burger', price: 55000, emoji: '🍔' },
    { id: uuidv4(), cat: catChickenId, st: stationGrilId, name: 'Nashty Strips (3pcs)', price: 38000, emoji: '🍗' },
    // Sides
    { id: uuidv4(), cat: catSidesId, st: stationGrilId, name: 'Waffle Fries', price: 22000, emoji: '🍟' },
    { id: uuidv4(), cat: catSidesId, st: stationGrilId, name: 'Coleslaw', price: 15000, emoji: '🥗' },
    { id: uuidv4(), cat: catSidesId, st: stationGrilId, name: 'Mac & Cheese', price: 25000, emoji: '🧀' },
    { id: uuidv4(), cat: catSidesId, st: stationGrilId, name: 'Rice', price: 10000, emoji: '🍚' },
    // Snacks
    { id: uuidv4(), cat: catSnacksId, st: stationGrilId, name: 'Popcorn Chicken', price: 28000, emoji: '🧆' },
    { id: uuidv4(), cat: catSnacksId, st: stationGrilId, name: 'Mozarella Sticks', price: 30000, emoji: '🧀' },
    // Drinks
    { id: uuidv4(), cat: catDrinksId, st: stationBarId, name: 'Lemon Tea', price: 18000, emoji: '🍋' },
    { id: uuidv4(), cat: catDrinksId, st: stationBarId, name: 'Iced Coffee', price: 22000, emoji: '☕' },
    { id: uuidv4(), cat: catDrinksId, st: stationBarId, name: 'Mineral Water', price: 8000, emoji: '💧' },
    { id: uuidv4(), cat: catDrinksId, st: stationBarId, name: 'Milkshake', price: 32000, emoji: '🥤' },
    { id: uuidv4(), cat: catDrinksId, st: stationBarId, name: 'Fresh Orange', price: 25000, emoji: '🍊' },
    { id: uuidv4(), cat: catDrinksId, st: stationBarId, name: 'Matcha Latte', price: 28000, emoji: '🍵' },
  ];

  const insertItem = db.prepare(`INSERT INTO menu_items (id, outlet_id, category_id, station_id, name, price, emoji, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  for (const item of items) {
    insertItem.run(item.id, outletId, item.cat, item.st, item.name, item.price, item.emoji, 1);
  }

  // Modifier Groups
  const spiceLevelId = uuidv4();
  const sizeId = uuidv4();
  const addOnId = uuidv4();
  const drinkTempId = uuidv4();
  const sugarId = uuidv4();

  const insertGroup = db.prepare(`INSERT INTO modifier_groups (id, outlet_id, name, is_required, min_select, max_select) VALUES (?, ?, ?, ?, ?, ?)`);
  insertGroup.run(spiceLevelId, outletId, 'Spice Level', 1, 1, 1);
  insertGroup.run(sizeId, outletId, 'Ukuran Porsi', 0, 0, 1);
  insertGroup.run(addOnId, outletId, 'Add On', 0, 0, 3);
  insertGroup.run(drinkTempId, outletId, 'Suhu Minuman', 1, 1, 1);
  insertGroup.run(sugarId, outletId, 'Kadar Gula', 0, 0, 1);

  const insertOpt = db.prepare(`INSERT INTO modifier_options (id, group_id, name, price_adjustment) VALUES (?, ?, ?, ?)`);
  // Spice levels
  insertOpt.run(uuidv4(), spiceLevelId, 'Level 0 (Mild)', 0);
  insertOpt.run(uuidv4(), spiceLevelId, 'Level 1 (Pedas)', 0);
  insertOpt.run(uuidv4(), spiceLevelId, 'Level 2 (Ekstra Pedas)', 0);
  insertOpt.run(uuidv4(), spiceLevelId, 'Level 3 (Gila Pedas)', 0);
  // Size
  insertOpt.run(uuidv4(), sizeId, 'Regular', 0);
  insertOpt.run(uuidv4(), sizeId, 'Large (+10rb)', 10000);
  // Add On
  insertOpt.run(uuidv4(), addOnId, 'Extra Saus (+5rb)', 5000);
  insertOpt.run(uuidv4(), addOnId, 'Extra Ayam (+25rb)', 25000);
  insertOpt.run(uuidv4(), addOnId, 'Keju (+8rb)', 8000);
  // Drink temp
  insertOpt.run(uuidv4(), drinkTempId, 'Dingin', 0);
  insertOpt.run(uuidv4(), drinkTempId, 'Panas', 0);
  // Sugar
  insertOpt.run(uuidv4(), sugarId, 'Normal', 0);
  insertOpt.run(uuidv4(), sugarId, 'Less Sugar', 0);
  insertOpt.run(uuidv4(), sugarId, 'No Sugar', 0);

  // Link modifiers to chicken items (spice level required + add on optional)
  const insertLink = db.prepare(`INSERT INTO menu_item_modifiers (id, menu_item_id, modifier_group_id) VALUES (?, ?, ?)`);
  const chickenItems = items.filter(i => i.cat === catChickenId);
  for (const ci of chickenItems) {
    insertLink.run(uuidv4(), ci.id, spiceLevelId);
    insertLink.run(uuidv4(), ci.id, addOnId);
    insertLink.run(uuidv4(), ci.id, sizeId);
  }

  // Link modifiers to drink items
  const drinkItems = items.filter(i => i.cat === catDrinksId);
  for (const di of drinkItems) {
    insertLink.run(uuidv4(), di.id, drinkTempId);
    insertLink.run(uuidv4(), di.id, sugarId);
  }

  console.log('✅ Seed selesai!');
  console.log(`   Outlet: ${outletId}`);
  console.log(`   Users: Sari (kasir/1234), Andi (kasir/5678), Budi (manager/0000), Reza (owner/9999)`);
}
