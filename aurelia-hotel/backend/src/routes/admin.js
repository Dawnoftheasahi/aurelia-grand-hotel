const express = require('express');
const { getDb } = require('../db/database');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Middleware: admin only
function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
}

// GET /api/admin/stats
router.get('/stats', authenticate, requireAdmin, (req, res) => {
  try {
    const db = getDb();
    const totalBookings  = db.prepare("SELECT COUNT(*) AS c FROM bookings").get()?.c || 0;
    const activeBookings = db.prepare("SELECT COUNT(*) AS c FROM bookings WHERE status = 'confirmed'").get()?.c || 0;
    const totalRevenue   = db.prepare("SELECT SUM(total_price) AS s FROM bookings WHERE status != 'cancelled'").get()?.s || 0;
    const totalUsers     = db.prepare("SELECT COUNT(*) AS c FROM users WHERE role = 'guest'").get()?.c || 0;
    const totalRooms     = db.prepare("SELECT COUNT(*) AS c FROM rooms").get()?.c || 0;
    const availRooms     = db.prepare("SELECT COUNT(*) AS c FROM rooms WHERE is_available = 1").get()?.c || 0;
    const cancelled      = db.prepare("SELECT COUNT(*) AS c FROM bookings WHERE status = 'cancelled'").get()?.c || 0;
    const completed      = db.prepare("SELECT COUNT(*) AS c FROM bookings WHERE status = 'completed'").get()?.c || 0;

    const recentBookings = db.prepare(`
      SELECT b.*, r.name AS room_name, r.type AS room_type, u.name AS guest_name, u.email AS guest_email
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC LIMIT 8
    `).all();

    const topRooms = db.prepare(`
      SELECT r.id, r.name, r.type, r.price_per_night, r.images,
             COUNT(b.id) AS booking_count,
             SUM(CASE WHEN b.status != 'cancelled' THEN b.total_price ELSE 0 END) AS revenue
      FROM rooms r
      LEFT JOIN bookings b ON r.id = b.room_id
      GROUP BY r.id ORDER BY booking_count DESC LIMIT 5
    `).all();

    res.json({
      stats: { totalBookings, activeBookings, totalRevenue, totalUsers, totalRooms, availRooms, cancelled, completed },
      recentBookings: recentBookings.map(b => ({ ...b, extras: JSON.parse(b.extras || '{}') })),
      topRooms: topRooms.map(r => ({ ...r, images: JSON.parse(r.images || '[]') }))
    });
  } catch (e) {
    console.error('Admin stats error:', e.message);
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

// GET /api/admin/bookings
router.get('/bookings', authenticate, requireAdmin, (req, res) => {
  try {
    const db = getDb();
    const { status, search } = req.query;
    let query = `SELECT b.*, r.name AS room_name, r.type AS room_type, r.images AS room_images,
                 u.name AS guest_name, u.email AS guest_email
                 FROM bookings b JOIN rooms r ON b.room_id = r.id JOIN users u ON b.user_id = u.id WHERE 1=1`;
    const params = [];
    if (status && status !== 'all') { query += ' AND b.status = ?'; params.push(status); }
    if (search) {
      query += ' AND (r.name LIKE ? OR b.confirmation_code LIKE ? OR u.name LIKE ? OR u.email LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }
    query += ' ORDER BY b.created_at DESC';
    const bookings = db.prepare(query).all(...params);
    res.json(bookings.map(b => ({
      ...b,
      extras:      JSON.parse(b.extras      || '{}'),
      room_images: JSON.parse(b.room_images || '[]')
    })));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// PATCH /api/admin/bookings/:id/status
router.patch('/bookings/:id/status', authenticate, requireAdmin, (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const db = getDb();
    const booking = db.prepare('SELECT id FROM bookings WHERE id = ?').get(Number(req.params.id));
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, Number(req.params.id));
    res.json({ message: 'Booking status updated' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// GET /api/admin/rooms
router.get('/rooms', authenticate, requireAdmin, (req, res) => {
  try {
    const db = getDb();
    const rooms = db.prepare(`
      SELECT r.*,
             COUNT(b.id) AS booking_count,
             SUM(CASE WHEN b.status != 'cancelled' THEN b.total_price ELSE 0 END) AS total_revenue
      FROM rooms r LEFT JOIN bookings b ON r.id = b.room_id
      GROUP BY r.id ORDER BY r.id
    `).all();
    res.json(rooms.map(r => ({
      ...r,
      images:    JSON.parse(r.images    || '[]'),
      amenities: JSON.parse(r.amenities || '[]')
    })));
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
});

// PATCH /api/admin/rooms/:id/availability
router.patch('/rooms/:id/availability', authenticate, requireAdmin, (req, res) => {
  try {
    const { is_available } = req.body;
    const db = getDb();
    db.prepare('UPDATE rooms SET is_available = ? WHERE id = ?').run(is_available ? 1 : 0, Number(req.params.id));
    const room = db.prepare('SELECT id, name, is_available FROM rooms WHERE id = ?').get(Number(req.params.id));
    res.json(room);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update room' });
  }
});

// GET /api/admin/users
router.get('/users', authenticate, requireAdmin, (req, res) => {
  try {
    const db = getDb();
    const users = db.prepare(`
      SELECT u.id, u.name, u.email, u.phone, u.role, u.created_at,
             COUNT(b.id) AS booking_count,
             SUM(CASE WHEN b.status != 'cancelled' THEN b.total_price ELSE 0 END) AS total_spent
      FROM users u LEFT JOIN bookings b ON u.id = b.user_id
      WHERE u.role = 'guest'
      GROUP BY u.id ORDER BY u.created_at DESC
    `).all();
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
