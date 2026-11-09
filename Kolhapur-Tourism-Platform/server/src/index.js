const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
require('dotenv').config();

const { connectDB, getIsConnected } = require('./config/db');
connectDB();

const db = require('./db/dbService');

// Route imports
const authRoutes = require('./routes/authRoutes');
const destinationsRoutes = require('./routes/destinationsRoutes');
const hotelsRoutes = require('./routes/hotelsRoutes');
const bookingsRoutes = require('./routes/bookingsRoutes');
const reviewsRoutes = require('./routes/reviewsRoutes');
const eventsRoutes = require('./routes/eventsRoutes');
const contactRoutes = require('./routes/contactRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const itineraryRoutes = require('./routes/itineraryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const toursRoutes = require('./routes/toursRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static images and assets serving
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Kolhapur Tourism Discovery & Travel Planning API',
    database: getIsConnected() ? 'MongoDB (Connected)' : 'JSON Database (Active)',
    version: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationsRoutes);
app.use('/api/hotels', hotelsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tours', toursRoutes);

// In production, serve built client
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// Fallback SPA catch-all middleware for client-side routing
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: `API route not found: ${req.path}` });
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Kolhapur Tourism API</title><style>body{font-family:sans-serif;padding:2rem;text-align:center;}</style></head>
        <body>
          <h2>Kolhapur Tourism Server is Running!</h2>
          <p>API is active at <code>/api</code>. Start the Vite client for frontend development via <code>npm run client</code> or build it with <code>npm run build</code>.</p>
        </body>
        </html>
      `);
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏰 KOLHAPUR TOURISM PLATFORM - BACKEND ACTIVE`);
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📍 API endpoints base: http://localhost:${PORT}/api`);
  console.log(`🖼️ Static images at: http://localhost:${PORT}/images`);
  console.log(`=======================================================`);
});
