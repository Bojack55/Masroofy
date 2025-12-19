/*
 * Eyad Ahmed Saeed - 13005578
 * Feature: Visual Budget Tracker
 * 
 * Shows how much of the allowance is spent
 * Returns percentage and color status (green/orange/red)
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware');

// Get budget info
router.get('/budget', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        // get total transfers received this month
        const incomingTransfers = await Transaction.aggregate([
            {
                $match: {
                    receiverId: user._id,
                    type: 'transfer',
                    timestamp: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    totalBudget: { $sum: '$amount' }
                }
            }
        ]);

        const totalBudget = incomingTransfers.length > 0 ? incomingTransfers[0].totalBudget : 0;
        const spent = totalBudget - user.balance;
        const percentage = totalBudget > 0 ? ((spent / totalBudget) * 100).toFixed(2) : 0;

        // color based on spending
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

// monthly breakdown - might need this for charts
router.get('/monthly-breakdown', authMiddleware, async (req, res) => {
    try {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const incomeBreakdown = await Transaction.aggregate([
            {
                $match: {
                    receiverId: req.user._id,
                    type: { $in: ['deposit', 'transfer'] },
                    timestamp: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
                }
            },
            {
                $group: {
                    _id: '$type',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const expenseBreakdown = await Transaction.aggregate([
            {
                $match: {
                    senderId: req.user._id,
                    type: 'expense',
                    timestamp: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                income: incomeBreakdown,
                expenses: expenseBreakdown,
                month: today.toLocaleString('default', { month: 'long' }),
                year: today.getFullYear()
            }
        });
    } catch (error) {
        console.error('Monthly breakdown error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error calculating breakdown'
        });
    }
});

module.exports = router;

/*
 * POSTMAN:
 * GET /api/analytics/budget - needs token
 * GET /api/analytics/monthly-breakdown - needs token
 */
