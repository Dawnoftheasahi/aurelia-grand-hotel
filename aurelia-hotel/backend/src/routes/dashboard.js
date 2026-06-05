const express = require('express');
const { getDb } = require('../db/database');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.get('/summary', authenticate, (req, res) => {
  try {
    const db  = getDb();
    const uid = req.user.id;
    const today = new Date().toISOString().split('T')[0];

    const total     = db.prepare('SELECT COUNT(*) AS c FROM bookings WHERE user_id = ?').get(uid)?.c || 0;
    const upcoming  = db.prepare("SELECT COUNT(*) AS c FROM bookings WHERE user_id = ? AND status = 'confirmed' AND check_in >= ?").get(uid, today)?.c || 0;
    const completed = db.prepare("SELECT COUNT(*) AS c FROM bookings WHERE user_id = ? AND status = 'completed'").get(uid)?.c || 0;
    const cancelled = db.prepare("SELECT COUNT(*) AS c FROM bookings WHERE user_id = ? AND status = 'cancelled'").get(uid)?.c || 0;
    const spentRow  = db.prepare("SELECT SUM(total_price) AS s FROM bookings WHERE user_id = ? AND status != 'cancelled'").get(uid);
    const totalSpent = spentRow?.s || 0;

    const nextBooking = db.prepare(`
      SELECT b.*, r.name AS room_name, r.type AS room_type, r.images AS room_images
      FROM bookings b JOIN rooms r ON b.room_id = r.id
      WHERE b.user_id = ? AND b.status = 'confirmed' AND b.check_in >= ?
      ORDER BY b.check_in ASC LIMIT 1
    `).get(uid, today);

    const recentBookings = db.prepare(`
      SELECT b.*, r.name AS room_name, r.type AS room_type, r.images AS room_images
      FROM bookings b JOIN rooms r ON b.room_id = r.id
      WHERE b.user_id = ? ORDER BY b.created_at DESC LIMIT 3
    `).all(uid);

    res.json({
      stats: { total, upcoming, completed, cancelled, totalSpent },
      nextBooking: nextBooking
        ? { ...nextBooking, extras: JSON.parse(nextBooking.extras || '{}'), room_images: JSON.parse(nextBooking.room_images || '[]') }
        : null,
      recentBookings: recentBookings.map(b => ({
        ...b,
        extras:      JSON.parse(b.extras      || '{}'),
        room_images: JSON.parse(b.room_images || '[]')
      }))
    });
  } catch (e) {
    console.error('Dashboard error:', e.message, e.stack);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

module.exports = router;
