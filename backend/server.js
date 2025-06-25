const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  // origin: '*',
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());

// Routes
const parkingRoutes = require('./routes/parking');
const authRoutes = require('./routes/auth');

app.use('/api/parking', parkingRoutes);
app.use('/api/auth', authRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Parking App API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});