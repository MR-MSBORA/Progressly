import express from 'express'
import dotenv from 'dotenv'
import cors from "cors"
import mongoose from 'mongoose'  // ⬅️ ADD THIS
import authRoutes from './routes/auth.routes.js'

// Load environment variables FIRST
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⬇️ ADD: MongoDB Connection Function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    console.error('💡 Troubleshooting:');
    console.error('   1. Check if MONGODB_URI is set in .env file');
    console.error('   2. If using local MongoDB, make sure it is running');
    console.error('   3. If using Atlas, check IP whitelist and credentials');
    process.exit(1);
  }
};

// ⬇️ CALL the connection function
connectDB();

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'ProgressTrack API is running! 🚀',
    status: 'success',
    timestamp: new Date().toISOString()
  });
});

// API test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API endpoint working! ✅',
    environment: process.env.NODE_ENV || 'development'
  });
});

// AUTH ROUTES
app.use('/api/auth', authRoutes);

// 404 handler (should be after all routes)
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API URL: http://localhost:${PORT}`);
  console.log('=================================');
});