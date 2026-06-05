const express = require('express');
const { getDb } = require('../db/database');
const { authenticate, optionalAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/:roomId', optionalAuth, (req, res) => {
  try {
    const db = getDb();
    const reviews = db.prepare(`
      SELECT rv.*, u.name AS user_name
      FROM reviews rv JOIN users u ON rv.user_id = u.id
      WHERE rv.room_id = ? ORDER BY rv.created_at DESC
    `).all(Number(req.params.roomId));
    res.json(reviews);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

router.post('/', authenticate, (req, res) => {
  try {
    const { room_id, booking_id, rating, title, comment } = req.body;
    if (!room_id || !rating) return res.status(400).json({ error: 'Room and rating are required' });
    if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1-5' });

    const db = getDb();
    const result = db.prepare(
      'INSERT INTO reviews (user_id,room_id,booking_id,rating,title,comment) VALUES (?,?,?,?,?,?)'
    ).run(req.user.id, Number(room_id), booking_id ? Number(booking_id) : null, Number(rating), title || null, comment || null);

    const avgRow = db.prepare('SELECT AVG(rating) AS avg, COUNT(*) AS cnt FROM reviews WHERE room_id = ?').get(Number(room_id));
    db.prepare('UPDATE rooms SET rating = ?, review_count = ? WHERE id = ?')
      .run(Math.round((avgRow?.avg || rating) * 10) / 10, avgRow?.cnt || 1, Number(room_id));

    const review = db.prepare('SELECT rv.*, u.name AS user_name FROM reviews rv JOIN users u ON rv.user_id = u.id WHERE rv.id = ?').get(Number(result.lastInsertRowid));
    res.status(201).json(review);
  } catch (e) {
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

module.exports = router;
