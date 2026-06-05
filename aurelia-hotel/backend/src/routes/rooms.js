const express = require('express');
const { getDb } = require('../db/database');
const router = express.Router();

// GET /api/rooms
router.get('/', (req, res) => {
  try {
    const db = getDb();
    const { type, min_price, max_price, capacity, search, sort = 'rating' } = req.query;

    let query = 'SELECT * FROM rooms WHERE is_available = 1';
    const params = [];

    if (type)      { query += ' AND type = ?';                                  params.push(type); }
    if (min_price) { query += ' AND price_per_night >= ?';                      params.push(Number(min_price)); }
    if (max_price) { query += ' AND price_per_night <= ?';                      params.push(Number(max_price)); }
    if (capacity)  { query += ' AND capacity >= ?';                             params.push(Number(capacity)); }
    if (search)    {
      query += ' AND (name LIKE ? OR description LIKE ? OR type LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    const sortMap = {
      price_asc:  'price_per_night ASC',
      price_desc: 'price_per_night DESC',
      rating:     'rating DESC',
      capacity:   'capacity DESC',
      name:       'name ASC'
    };
    query += ` ORDER BY ${sortMap[sort] || 'rating DESC'}`;

    const rooms = db.prepare(query).all(...params);
    const parsed = rooms.map(r => ({
      ...r,
      images:    JSON.parse(r.images    || '[]'),
      amenities: JSON.parse(r.amenities || '[]')
    }));
    res.json(parsed);
  } catch (e) {
    console.error('Rooms error:', e.message);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// GET /api/rooms/:id
router.get('/:id', (req, res) => {
  try {
    const db = getDb();
    const room = db.prepare('SELECT * FROM rooms WHERE id = ?').get(Number(req.params.id));
    if (!room) return res.status(404).json({ error: 'Room not found' });
    res.json({
      ...room,
      images:    JSON.parse(room.images    || '[]'),
      amenities: JSON.parse(room.amenities || '[]')
    });
  } catch (e) {
    console.error('Room detail error:', e.message);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
});

// GET /api/rooms/:id/availability
router.get('/:id/availability', (req, res) => {
  try {
    const db = getDb();
    const { year, month } = req.query;
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    const bookedDates = db.prepare(
      "SELECT check_in, check_out FROM bookings WHERE room_id = ? AND status != 'cancelled' AND check_in LIKE ?"
    ).all(Number(req.params.id), `${prefix}%`);
    res.json(bookedDates);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

module.exports = router;
