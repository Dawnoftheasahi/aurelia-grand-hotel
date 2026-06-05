const express = require('express');
const { getDb } = require('../db/database');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

function genCode() {
  return 'AUR' + Math.random().toString(36).substring(2, 8).toUpperCase();
}
function nightsBetween(checkIn, checkOut) {
  return Math.max(0, Math.round((new Date(checkOut) - new Date(checkIn)) / 86400000));
}

// POST /api/bookings
router.post('/', authenticate, (req, res) => {
  try {
    const { room_id, check_in, check_out, guests, extras = {}, special_requests, promo_code } = req.body;
    if (!room_id || !check_in || !check_out || !guests)
      return res.status(400).json({ error: 'Room, dates and guests are required' });

    const checkInDate  = new Date(check_in);
    const checkOutDate = new Date(check_out);
    if (checkInDate >= checkOutDate)
      return res.status(400).json({ error: 'Check-out must be after check-in' });
    if (checkInDate < new Date(new Date().toDateString()))
      return res.status(400).json({ error: 'Check-in cannot be in the past' });

    const db   = getDb();
    const room = db.prepare('SELECT * FROM rooms WHERE id = ? AND is_available = 1').get(Number(room_id));
    if (!room) return res.status(404).json({ error: 'Room not found or unavailable' });
    if (Number(guests) > room.capacity)
      return res.status(400).json({ error: `Room capacity is ${room.capacity} guests` });

    // Conflict detection
    const conflict = db.prepare(
      "SELECT id FROM bookings WHERE room_id = ? AND status != 'cancelled' AND check_in < ? AND check_out > ?"
    ).get(Number(room_id), check_out, check_in);
    if (conflict) return res.status(409).json({ error: 'Room is not available for the selected dates' });

    const nights = nightsBetween(check_in, check_out);
    let extrasTotal = 0;
    if (extras.breakfast)       extrasTotal += 25 * nights * Number(guests);
    if (extras.airportTransfer) extrasTotal += 80;
    if (extras.lateCheckout)    extrasTotal += 50;
    if (extras.extraBed)        extrasTotal += 40 * nights;

    let totalPrice = (room.price_per_night * nights) + extrasTotal;
    let discountApplied = 0;

    if (promo_code) {
      const promo = db.prepare("SELECT * FROM promotions WHERE code = ? AND is_active = 1").get(promo_code.toUpperCase());
      if (promo) {
        discountApplied = Math.round(totalPrice * promo.discount_percent / 100);
        totalPrice -= discountApplied;
        db.prepare('UPDATE promotions SET uses_count = uses_count + 1 WHERE id = ?').run(Number(promo.id));
      }
    }

    const code   = genCode();
    const result = db.prepare(
      'INSERT INTO bookings (user_id,room_id,check_in,check_out,guests,nights,room_price,extras,extras_price,total_price,status,special_requests,confirmation_code) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)'
    ).run(req.user.id, Number(room_id), check_in, check_out, Number(guests), nights, room.price_per_night, JSON.stringify(extras), extrasTotal, totalPrice, 'confirmed', special_requests || null, code);

    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(Number(result.lastInsertRowid));
    res.status(201).json({
      ...booking,
      extras: JSON.parse(booking.extras || '{}'),
      room:   { ...room, images: JSON.parse(room.images || '[]'), amenities: JSON.parse(room.amenities || '[]') },
      discount_applied: discountApplied
    });
  } catch (e) {
    console.error('Create booking error:', e.message);
    res.status(500).json({ error: e.message || 'Failed to create booking' });
  }
});

// GET /api/bookings
router.get('/', authenticate, (req, res) => {
  try {
    const db = getDb();
    const { status, search } = req.query;
    let query = 'SELECT b.*, r.name as room_name, r.type as room_type, r.images as room_images, r.price_per_night FROM bookings b JOIN rooms r ON b.room_id = r.id WHERE b.user_id = ?';
    const params = [req.user.id];
    if (status && status !== 'all') { query += ' AND b.status = ?'; params.push(status); }
    if (search) {
      query += ' AND (r.name LIKE ? OR b.confirmation_code LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s);
    }
    query += ' ORDER BY b.created_at DESC';

    const bookings = db.prepare(query).all(...params);
    res.json(bookings.map(b => ({
      ...b,
      extras:      JSON.parse(b.extras      || '{}'),
      room_images: JSON.parse(b.room_images || '[]')
    })));
  } catch (e) {
    console.error('Get bookings error:', e.message);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// GET /api/bookings/:id
router.get('/:id', authenticate, (req, res) => {
  try {
    const db = getDb();
    const booking = db.prepare(`
      SELECT b.*, r.name as room_name, r.type as room_type, r.images as room_images,
             r.amenities as room_amenities, r.price_per_night, r.bed_type, r.size_sqm, r.floor, r.view_type,
             u.name as user_name, u.email as user_email
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN users u ON b.user_id = u.id
      WHERE b.id = ? AND b.user_id = ?
    `).get(Number(req.params.id), req.user.id);

    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({
      ...booking,
      extras:         JSON.parse(booking.extras         || '{}'),
      room_images:    JSON.parse(booking.room_images    || '[]'),
      room_amenities: JSON.parse(booking.room_amenities || '[]')
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// PATCH /api/bookings/:id/cancel
router.patch('/:id/cancel', authenticate, (req, res) => {
  try {
    const db = getDb();
    const booking = db.prepare('SELECT * FROM bookings WHERE id = ? AND user_id = ?').get(Number(req.params.id), req.user.id);
    if (!booking)                     return res.status(404).json({ error: 'Booking not found' });
    if (booking.status === 'cancelled') return res.status(400).json({ error: 'Booking already cancelled' });
    if (booking.status === 'completed') return res.status(400).json({ error: 'Completed bookings cannot be cancelled' });

    const daysUntil = Math.ceil((new Date(booking.check_in) - new Date()) / 86400000);
    if (daysUntil < 1) return res.status(400).json({ error: 'Cannot cancel within 24 hours of check-in' });

    db.prepare("UPDATE bookings SET status = 'cancelled' WHERE id = ?").run(Number(req.params.id));
    res.json({ message: 'Booking cancelled successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
});

module.exports = router;
