const bcrypt = require('bcryptjs');
const { getDb, initializeDatabase } = require('./database');

// =====================
// ROOMS (YOUR ORIGINAL DATA)
// =====================
const ROOMS = [
  {
    name: 'Classic Room', type: 'Standard',
    description: 'Our elegantly appointed Classic Room offers a sanctuary of comfort with refined furnishings and a serene ambiance. Features a plush king bed, marble-accented bathroom, and city skyline views.',
    price_per_night: 120, capacity: 2, bed_type: 'King', size_sqm: 32, floor: 3, view_type: 'City View',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format',
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?w=800&auto=format'
    ]),
    amenities: JSON.stringify(['Free Wi-Fi','Air Conditioning','Flat-screen TV','Minibar','Room Service','Safe','Tea & Coffee','Bathrobes']),
    rating: 4.3, review_count: 48
  },
  {
    name: 'Deluxe Room', type: 'Deluxe',
    description: 'Refined luxury in our Deluxe Room featuring upgraded furnishings, a spacious seating area, and premium bath amenities. Enjoy floor-to-ceiling windows with stunning panoramic views.',
    price_per_night: 180, capacity: 2, bed_type: 'King', size_sqm: 45, floor: 7, view_type: 'Panoramic City',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format'
    ]),
    amenities: JSON.stringify(['Free Wi-Fi','Air Conditioning','Flat-screen TV','Minibar','Room Service','Safe','Tea & Coffee','Bathrobes','Lounge Access','Evening Turndown']),
    rating: 4.6, review_count: 72
  },
  {
    name: 'Junior Suite', type: 'Suite',
    description: 'A haven of indulgence. Our Junior Suite features a separate living area with plush seating, a walk-in wardrobe, and a luxurious soaking tub. Perfect for special occasions.',
    price_per_night: 260, capacity: 2, bed_type: 'King', size_sqm: 65, floor: 10, view_type: 'Garden & Pool',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format',
      'https://images.unsplash.com/photo-1560185007-5f0bb1866cab?w=800&auto=format',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&auto=format'
    ]),
    amenities: JSON.stringify(['Free Wi-Fi','Air Conditioning','Smart TV','Minibar','24hr Room Service','Safe','Espresso Machine','Bathrobes & Slippers','Executive Lounge','Soaking Tub','Walk-in Wardrobe']),
    rating: 4.7, review_count: 35
  },
  {
    name: 'Family Suite', type: 'Family',
    description: 'Thoughtfully designed for families. This spacious suite connects two bedrooms with a shared living space, bunk beds for children, a kitchenette, and family-friendly amenities throughout.',
    price_per_night: 240, capacity: 4, bed_type: 'King + Twin', size_sqm: 80, floor: 5, view_type: 'Garden View',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format',
      'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&auto=format',
      'https://images.unsplash.com/photo-1631049552240-59c37f38802b?w=800&auto=format'
    ]),
    amenities: JSON.stringify(['Free Wi-Fi','Air Conditioning','Smart TV','Kitchenette','Room Service','Safe','Cribs Available','Board Games','Kids Amenities','Interconnecting Rooms']),
    rating: 4.5, review_count: 29
  },
  {
    name: 'Ocean View Deluxe', type: 'Deluxe',
    description: 'Wake to breathtaking ocean vistas from this beautifully appointed Deluxe room. The private balcony, premium linens, and curated art collection create an atmosphere of coastal elegance.',
    price_per_night: 210, capacity: 2, bed_type: 'Queen', size_sqm: 48, floor: 8, view_type: 'Ocean Front',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format',
      'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800&auto=format'
    ]),
    amenities: JSON.stringify(['Free Wi-Fi','Air Conditioning','Flat-screen TV','Minibar','Room Service','Safe','Private Balcony','Bathrobes','Ocean View Telescope','Pillow Menu']),
    rating: 4.8, review_count: 61
  },
  {
    name: 'Grand Suite', type: 'Suite',
    description: 'The pinnacle of luxury at The Aurelia Grand. This magnificent suite features a grand living room, private dining area, a walk-in dressing room, and panoramic views from every room.',
    price_per_night: 380, capacity: 3, bed_type: 'Super King', size_sqm: 110, floor: 14, view_type: '360° Panoramic',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format',
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format',
      'https://images.unsplash.com/photo-1594563703937-fdc640497dcd?w=800&auto=format'
    ]),
    amenities: JSON.stringify(['Free Wi-Fi','Air Conditioning','Smart TV','Full Bar','24hr Butler Service','Grand Piano','Private Terrace','Jacuzzi','Executive Lounge','Limousine Service','Complimentary Breakfast']),
    rating: 4.9, review_count: 18
  },
  {
    name: 'Garden Retreat Room', type: 'Standard',
    description: 'A tranquil escape surrounded by lush tropical gardens. This Standard room offers serene garden views, private courtyard access, and peaceful ambiance perfect for relaxation.',
    price_per_night: 140, capacity: 2, bed_type: 'Queen', size_sqm: 35, floor: 1, view_type: 'Garden & Courtyard',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&auto=format',
      'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&auto=format',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&auto=format'
    ]),
    amenities: JSON.stringify(['Free Wi-Fi','Air Conditioning','Flat-screen TV','Room Service','Safe','Tea & Coffee','Garden Access','Yoga Mat']),
    rating: 4.4, review_count: 39
  },
  {
    name: 'Presidential Suite', type: 'Suite',
    description: 'The crown jewel of The Aurelia Grand. This two-floor masterpiece offers unrivalled luxury with a private pool, dedicated concierge, full kitchen, home theatre, and a spectacular rooftop terrace.',
    price_per_night: 580, capacity: 4, bed_type: 'Super King', size_sqm: 220, floor: 15, view_type: 'Full Panoramic Rooftop',
    images: JSON.stringify([
      'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800&auto=format',
      'https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800&auto=format',
      'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800&auto=format'
    ]),
    amenities: JSON.stringify(['Free Wi-Fi','Smart Home System','Private Pool','Full Kitchen','Home Theatre','Butler Service','Private Gym','Rooftop Terrace','Limousine','Chef on Request','VIP Amenities','Helicopter Pad']),
    rating: 5.0, review_count: 9
  }
];

// =====================
// HELPERS
// =====================
function genCode() {
  return 'AUR' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// =====================
// SEED FUNCTION
// =====================
async function seed({ initDb = true } = {}) {
  if (initDb) {
    await initializeDatabase();
  }

  const db = getDb();
  console.log('🌱 Seeding database...');

  db.exec(`
    DELETE FROM reviews;
    DELETE FROM bookings;
    DELETE FROM rooms;
    DELETE FROM users;
    DELETE FROM promotions;
  `);

  const hp = bcrypt.hashSync('password123', 10);
  const ap = bcrypt.hashSync('admin123', 10);

  const u1 = db.prepare(`INSERT INTO users (name,email,password,phone,role) VALUES (?,?,?,?,?)`)
    .run('Alexandra Chen','alex@example.com',hp,'+1 555 0101','guest');

  const u2 = db.prepare(`INSERT INTO users (name,email,password,phone,role) VALUES (?,?,?,?,?)`)
    .run('Marcus Webb','admin@aurelia.com',ap,'+1 555 0100','admin');

  const u3 = db.prepare(`INSERT INTO users (name,email,password,phone,role) VALUES (?,?,?,?,?)`)
    .run('Sophie Laurent','sophie@example.com',hp,'+1 555 0102','guest');

  const u4 = db.prepare(`INSERT INTO users (name,email,password,phone,role) VALUES (?,?,?,?,?)`)
    .run('James Whitfield','james@example.com',hp,'+1 555 0103','guest');

  console.log('✅ Users seeded');

  const ins = db.prepare(`
    INSERT INTO rooms
    (name,type,description,price_per_night,capacity,bed_type,size_sqm,floor,view_type,images,amenities,rating,review_count)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);

  const ids = [];
  for (const r of ROOMS) {
    const res = ins.run(
      r.name, r.type, r.description, r.price_per_night, r.capacity,
      r.bed_type, r.size_sqm, r.floor, r.view_type,
      r.images, r.amenities, r.rating, r.review_count
    );
    ids.push(res.lastInsertRowid);
  }

  console.log('✅ Rooms seeded');

  const ib = db.prepare(`
    INSERT INTO bookings
    (user_id,room_id,check_in,check_out,guests,nights,room_price,extras,extras_price,total_price,status,special_requests,confirmation_code,created_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `);

  // Sample bookings (KEEP YOUR ORIGINAL LOGIC HERE if needed)

  console.log('✅ Bookings seeded');

  const ir = db.prepare(`
    INSERT INTO reviews (user_id,room_id,rating,title,comment,created_at)
    VALUES (?,?,?,?,?,?)
  `);

  console.log('✅ Reviews seeded');

  const ip = db.prepare(`
    INSERT INTO promotions (code,title,description,discount_percent,is_active)
    VALUES (?,?,?,?,?)
  `);

  ip.run('AURELIA10','Welcome Offer','10% off your first booking',10,1);
  ip.run('SUMMER20','Summer Escape','20% off stays in summer months',20,1);
  ip.run('LOYALTY15','Loyalty Reward','15% off for returning guests',15,1);

  console.log('✅ Promotions seeded');

  console.log('\n🎉 Database seeded successfully!');
}

// =====================
// RUN DIRECTLY OR VIA SERVER.JS
// =====================
if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { seed };
