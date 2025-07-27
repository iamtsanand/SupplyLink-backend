// --- Import Required Modules ---
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

// --- Initialize Express App ---
const app = express();

// --- Middleware Configuration ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON requests

// --- Database Connection ---
const connectDB = async () => {
  try {
    // Connect to MongoDB using URI from environment variables
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); // Exit the application if DB connection fails
  }
};

// Connect to DB on server start
connectDB();

// --- API Routes ---
app.use('/api/users', require('./routes/users')); // User management routes
app.use('/api/bids', require('./routes/bids')); // Bid submission & retrieval routes
app.use('/api/requirements', require('./routes/requirements')); // Requirement handling routes

// --- Start the Server ---
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });


//for vercel
module.exports = app;