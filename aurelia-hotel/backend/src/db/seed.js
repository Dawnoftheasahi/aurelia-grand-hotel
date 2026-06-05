const bcrypt = require('bcryptjs');
const { getDb, initializeDatabase } = require('./database');

// ... keep ROOMS, genCode(), and all your seed logic above

async function seed({ initDb = true } = {}) {
  if (initDb) {
    await initializeDatabase();
  }

  const db = getDb();
  console.log('🌱 Seeding database...');

  db.exec('DELETE FROM reviews; DELETE FROM bookings; DELETE FROM rooms; DELETE FROM users; DELETE FROM promotions;');

  const hp = bcrypt.hashSync('password123', 10);
  const ap = bcrypt.hashSync('admin123', 10);

  const u1 = db.prepare('INSERT INTO users (name,email,password,phone,role) VALUES (?,?,?,?,?)').run(
    'Alexandra Chen','alex@example.com',hp,'+1 555 0101','guest'
  );
  const u2 = db.prepare('INSERT INTO users (name,email,password,phone,role) VALUES (?,?,?,?,?)').run(
    'Marcus Webb','admin@aurelia.com',ap,'+1 555 0100','admin'
  );
  const u3 = db.prepare('INSERT INTO users (name,email,password,phone,role) VALUES (?,?,?,?,?)').run(
    'Sophie Laurent','sophie@example.com',hp,'+1 555 0102','guest'
  );
  const u4 = db.prepare('INSERT INTO users (name,email,password,phone,role) VALUES (?,?,?,?,?)').run(
    'James Whitfield','james@example.com',hp,'+1 555 0103','guest'
  );

  console.log('✅ Users seeded');

  const ins = db.prepare(
    'INSERT INTO rooms (name,type,description,price_per_night,capacity,bed_type,size_sqm,floor,view_type,images,amenities,rating,review_count) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)'
  );

  const ids = [];
  for (const r of ROOMS) {
    const res = ins.run(
      r.name, r.type, r.description, r.price_per_night, r.capacity,
      r.bed_type, r.size_sqm, r.floor, r.view_type, r.images,
      r.amenities, r.rating, r.review_count
    );
    ids.push(res.lastInsertRowid);
  }

  console.log('✅ Rooms seeded');

  const ib = db.prepare(
    'INSERT INTO bookings (user_id,room_id,check_in,check_out,guests,nights,room_price,extras,extras_price,total_price,status,special_requests,confirmation_code,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
  );

  // keep the rest of your booking/review/promotion inserts exactly as they are
  // ...

  console.log('\n🎉 Database seeded successfully!');
  console.log('📧 Guest login:  alex@example.com   / password123');
  console.log('📧 Admin login:  admin@aurelia.com  / admin123');
}

if (require.main === module) {
  seed().catch(e => {
    console.error(e);
    process.exit(1);
  });
}

module.exports = { seed };
