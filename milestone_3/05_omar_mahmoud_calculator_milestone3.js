/*
 * Omar Mahmoud - 13006696
 * Feature: Smart Daily Calculator
 * 
 * Calculates how much you can spend per day
 * based on balance and days left in month
 */

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware');

// basic daily forecast
router.get('/forecast', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const today = new Date();
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const daysRemaining = Math.ceil((lastDayOfMonth - today) / (1000 * 60 * 60 * 24));

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

// detailed spending analysis
router.get('/spending-analysis', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const daysElapsed = Math.ceil((today - firstDayOfMonth) / (1000 * 60 * 60 * 24));
        const daysRemaining = Math.ceil((lastDayOfMonth - today) / (1000 * 60 * 60 * 24));

        // how much spent this month
        const expensesAggregate = await Transaction.aggregate([
            {
                $match: {
                    senderId: user._id,
                    type: 'expense',
                    timestamp: { $gte: firstDayOfMonth, $lte: today }
                }
            },
            {
                $group: {
                    _id: null,
                    totalSpent: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalSpent = expensesAggregate.length > 0 ? expensesAggregate[0].totalSpent : 0;
        const expenseCount = expensesAggregate.length > 0 ? expensesAggregate[0].count : 0;

        const avgDailySpending = daysElapsed > 0 ? (totalSpent / daysElapsed).toFixed(2) : 0;
        const avgPerTransaction = expenseCount > 0 ? (totalSpent / expenseCount).toFixed(2) : 0;

        // projected balance at end of month
        const projectedSpending = parseFloat(avgDailySpending) * daysRemaining;
        const projectedBalance = user.balance - projectedSpending;

        const safeDailySpend = daysRemaining > 0 ? (user.balance / daysRemaining).toFixed(2) : user.balance.toFixed(2);

        // simple risk check
        let riskLevel = 'low';
        let advice = 'Your spending is on track!';

        if (projectedBalance < 0) {
            riskLevel = 'high';
            advice = 'Warning: You may run out of funds before month end!';
        } else if (projectedBalance < user.balance * 0.2) {
            riskLevel = 'medium';
            advice = 'Consider reducing daily spending to maintain savings.';
        }

        res.json({
            success: true,
            data: {
                currentBalance: user.balance,
                daysRemaining,
                daysElapsed,
                totalSpentThisMonth: totalSpent,
                expenseCount,
                avgDailySpending: parseFloat(avgDailySpending),
                avgPerTransaction: parseFloat(avgPerTransaction),
                projectedBalance: parseFloat(projectedBalance.toFixed(2)),
                safeDailySpend: parseFloat(safeDailySpend),
                riskLevel,
                advice
            }
        });
    } catch (error) {
        console.error('Spending analysis error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error calculating analysis'
        });
    }
});

// weekly spending summary
router.get('/weekly-summary', authMiddleware, async (req, res) => {
    try {
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        const dailyExpenses = await Transaction.aggregate([
            {
                $match: {
                    senderId: req.user._id,
                    type: 'expense',
                    timestamp: { $gte: weekAgo, $lte: today }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
                    dailyTotal: { $sum: '$amount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const weeklyTotal = dailyExpenses.reduce((sum, day) => sum + day.dailyTotal, 0);
        const avgDaily = dailyExpenses.length > 0 ? (weeklyTotal / dailyExpenses.length).toFixed(2) : 0;

        res.json({
            success: true,
            data: {
                weeklyTotal,
                avgDaily: parseFloat(avgDaily),
                daysWithExpenses: dailyExpenses.length,
                dailyBreakdown: dailyExpenses
            }
        });
    } catch (error) {
        console.error('Weekly summary error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error calculating weekly summary'
        });
    }
});

module.exports = router;

/*
 * POSTMAN:
 * GET /api/analytics/forecast
 * GET /api/analytics/spending-analysis
 * GET /api/analytics/weekly-summary
 * all need token
 */
