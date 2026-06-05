require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const { initializeDatabase } = require('./src/db/database');

const authRoutes      = require('./src/routes/auth');
const roomRoutes      = require('./src/routes/rooms');
const bookingRoutes   = require('./src/routes/bookings');
const dashboardRoutes = require('./src/routes/dashboard');
const reviewRoutes    = require('./src/routes/reviews');
const promotionRoutes = require('./src/routes/promotions');
const adminRoutes     = require('./src/routes/admin');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth',       authRoutes);
app.use('/api/rooms',      roomRoutes);
app.use('/api/bookings',   bookingRoutes);
app.use('/api/dashboard',  dashboardRoutes);
app.use('/api/reviews',    reviewRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/admin',      adminRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'The Aurelia Grand API is running' }));
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));
app.use((err, req, res, next) => { console.error(err.stack); res.status(500).json({ error: 'Internal server error' }); });

initializeDatabase().then(() => {
  app.listen(PORT, () => console.log(`✨ Aurelia Grand API running on port ${PORT}`));
}).catch(err => { console.error('DB init failed:', err); process.exit(1); });
