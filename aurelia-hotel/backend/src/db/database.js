const path = require('path');
const fs   = require('fs');
const initSqlJs = require('sql.js');

const DB_PATH = path.join(__dirname, '../../aurelia.db');

let _db   = null;
let _sqljs = null;

function saveDb() {
  if (!_db) return;
  try {
    const buf = Buffer.from(_db.export());
    fs.writeFileSync(DB_PATH, buf);
  } catch(e) { console.error('DB save error:', e.message); }
}

/** Row-object helper from sql.js result set */
function toObjects(res) {
  if (!res || res.length === 0) return [];
  const { columns, values } = res[0];
  return values.map(row => {
    const obj = {};
    columns.forEach((col, i) => { obj[col] = row[i]; });
    return obj;
  });
}

class Statement {
  constructor(sql) { this.sql = sql; }

  all(...args) {
    const bind = args.flat();
    try {
      return toObjects(_db.exec(this.sql, bind.length ? bind : undefined));
    } catch(e) { console.error('DB query error:', e.message, this.sql); return []; }
  }

  get(...args) { return this.all(...args)[0] ?? null; }

  run(...args) {
    const bind = args.flat();
    try {
      _db.run(this.sql, bind.length ? bind : undefined);
      const row = toObjects(_db.exec('SELECT last_insert_rowid() AS id, changes() AS c'))[0];
      saveDb();
      return { lastInsertRowid: row?.id ?? null, changes: row?.c ?? 0 };
    } catch(e) {
      console.error('DB run error:', e.message, this.sql);
      throw e;
    }
  }
}

const wrappedDb = {
  prepare: (sql) => new Statement(sql),
  exec:    (sql) => { _db.run(sql); saveDb(); },
};

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL, password TEXT NOT NULL,
  phone TEXT, role TEXT DEFAULT 'guest', avatar_url TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
  type TEXT NOT NULL, description TEXT, price_per_night REAL NOT NULL,
  capacity INTEGER NOT NULL, bed_type TEXT, size_sqm INTEGER,
  floor INTEGER, view_type TEXT, images TEXT DEFAULT '[]',
  amenities TEXT DEFAULT '[]', is_available INTEGER DEFAULT 1,
  rating REAL DEFAULT 4.5, review_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL,
  room_id INTEGER NOT NULL, check_in TEXT NOT NULL, check_out TEXT NOT NULL,
  guests INTEGER NOT NULL DEFAULT 1, nights INTEGER NOT NULL,
  room_price REAL NOT NULL, extras TEXT DEFAULT '{}',
  extras_price REAL DEFAULT 0, total_price REAL NOT NULL,
  status TEXT DEFAULT 'confirmed', special_requests TEXT,
  confirmation_code TEXT UNIQUE, created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);
CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL,
  room_id INTEGER NOT NULL, booking_id INTEGER,
  rating INTEGER NOT NULL, title TEXT, comment TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS promotions (
  id INTEGER PRIMARY KEY AUTOINCREMENT, code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL, description TEXT, discount_percent INTEGER NOT NULL,
  valid_from TEXT, valid_until TEXT, is_active INTEGER DEFAULT 1,
  uses_limit INTEGER, uses_count INTEGER DEFAULT 0
);
`;

async function initializeDatabase() {
  _sqljs = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    const buf = fs.readFileSync(DB_PATH);
    _db = new _sqljs.Database(buf);
  } else {
    _db = new _sqljs.Database();
  }

  // Create tables
  SCHEMA.split(';').forEach(stmt => {
    const s = stmt.trim();
    if (s) { try { _db.run(s + ';'); } catch(e) {} }
  });
  saveDb();

  console.log('✅ Database initialized');
  return wrappedDb;
}

function getDb() {
  if (!_db) throw new Error('Database not initialized');
  return wrappedDb;
}

module.exports = { getDb, initializeDatabase };
