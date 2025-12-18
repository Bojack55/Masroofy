const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware');

// Daily Spending Forecast (Child)
router.get('/forecast', authMiddleware, async (req, res) => {
    try {
        // Get user's current balance
        const user = await User.findById(req.user._id);

        // Calculate days remaining in current month
        const today = new Date();
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const daysRemaining = Math.ceil((lastDayOfMonth - today) / (1000 * 60 * 60 * 24));

        // Calculate safe daily spend
        const safeDailySpend = daysRemaining > 0
            ? (user.balance / daysRemaining).toFixed(2)
            : user.balance.toFixed(2);

        res.json({
            success: true,
            data: {
                currentBalance: user.balance,
                daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
                safeDailySpend: parseFloat(safeDailySpend)
            }
        });
    } catch (error) {
        console.error('Forecast error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error calculating forecast'
        });
    }
});

// Budget Tracker (Child)
router.get('/budget', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        // Get first and last day of current month
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        // Calculate total incoming transfers this month
        const incomingTransfers = await Transaction.aggregate([
            {
                $match: {
                    receiverId: user._id,
                    type: 'transfer',
                    timestamp: {
                        $gte: firstDayOfMonth,
                        $lte: lastDayOfMonth
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalBudget: { $sum: '$amount' }
                }
            }
        ]);

        const totalBudget = incomingTransfers.length > 0
            ? incomingTransfers[0].totalBudget
            : 0;

        // Calculate spent amount (budget - current balance)
        const spent = totalBudget - user.balance;

        // Calculate percentage
        const percentage = totalBudget > 0
            ? ((spent / totalBudget) * 100).toFixed(2)
            : 0;

        // Determine status color
        let status = 'green';
        if (percentage > 80) status = 'red';
        else if (percentage > 50) status = 'orange';

        res.json({
            success: true,
            data: {
                totalBudget,
                spent,
                remaining: user.balance,
                percentage: parseFloat(percentage),
                status
            }
        });
    } catch (error) {
        console.error('Budget error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error calculating budget'
        });
    }
});

module.exports = router;
