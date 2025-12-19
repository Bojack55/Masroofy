const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection with better error handling
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wallet-system';
console.log('🔌 Attempting to connect to MongoDB...');
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.error('⚠️  Server will continue running but database operations will fail');
        console.error('Please whitelist your IP in MongoDB Atlas: https://cloud.mongodb.com');
    });

// Import Routes
const authRoutes = require('./01_moaz_abdelaleem_auth');
const walletRoutes = require('./03_Omar_khaled_wallet_topup');
const analyticsRoutes = require('./05_omar_mahmoud_smart_calculator');
const budgetRoutes = require('./02_eyad_ahmed_budget_tracker');
const transactionRoutes = require('./04_omar_samer_transaction_history');
const childAccountRoutes = require('./06_bahaa_ahmed_child_accounts');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/analytics', budgetRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/child-accounts', childAccountRoutes);

// Serve React build
const buildPath = path.join(__dirname, 'frontend', 'build');
app.use(express.static(buildPath));
// All non-API routes should return index.html (React router handles them)
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(buildPath, 'index.html'));
    }
});

// Health Check Route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Wallet API is running',
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 API available at http://localhost:${PORT}/api`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});
