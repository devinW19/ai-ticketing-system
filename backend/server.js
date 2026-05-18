require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize the Express application
const app = express();

// Apply Middleware
app.use(cors());
app.use(express.json()); // Allows the server to accept JSON data in the request body

// Establish Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Enterprise Database'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Create a Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'Operational', 
    message: 'IT Ticketing API is running securely.' 
  });
});

// Connect the Ticket API routes
app.use('/api/tickets', require('./routes/ticketRoutes'));

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 