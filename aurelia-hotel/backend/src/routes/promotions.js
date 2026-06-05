const express = require('express');
const { getDb } = require('../db/database');
const router = express.Router();

router.get('/', (req, res) => {
  try {
    const db = getDb();
    const promos = db.prepare('SELECT id, code, title, description, discount_percent FROM promotions WHERE is_active = 1').all();
    res.json(promos);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch promotions' });
  }
});

router.post('/validate', (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Code required' });
    const db    = getDb();
    const promo = db.prepare('SELECT id, code, title, description, discount_percent FROM promotions WHERE code = ? AND is_active = 1').get(code.toUpperCase());
    if (!promo)  return res.status(404).json({ error: 'Invalid or expired promo code' });
    res.json(promo);
  } catch (e) {
    res.status(500).json({ error: 'Failed to validate code' });
  }
});

module.exports = router;
