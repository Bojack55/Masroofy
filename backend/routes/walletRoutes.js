const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware');

// Get Balance (Protected)
router.get('/balance', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('balance');

        res.json({
            success: true,
            balance: user.balance
        });
    } catch (error) {
        console.error('Get balance error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching balance'
        });
    }
});

// Deposit (Top-Up) - Parent Only
router.post('/deposit', authMiddleware, async (req, res) => {
    try {
        const { amount } = req.body;

        // Check if user is a parent
        if (req.user.role !== 'parent') {
            return res.status(403).json({
                success: false,
                message: 'Only parents can deposit funds'
            });
        }

        // Validate amount
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid deposit amount'
            });
        }

        // Update user balance
        const user = await User.findById(req.user._id);
        user.balance += parseFloat(amount);
        await user.save();

        // Create transaction record
        const transaction = new Transaction({
            type: 'deposit',
            amount: parseFloat(amount),
            receiverId: user._id,
            description: 'Wallet top-up'
        });
        await transaction.save();

        res.json({
            success: true,
            message: 'Deposit successful',
            newBalance: user.balance,
            transaction: {
                id: transaction._id,
                type: transaction.type,
                amount: transaction.amount,
                timestamp: transaction.timestamp
            }
        });
    } catch (error) {
        console.error('Deposit error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error processing deposit'
        });
    }
});

// Transfer - Parent to Child
router.post('/transfer', authMiddleware, async (req, res) => {
    try {
        const { childId, amount } = req.body;

        // Check if user is a parent
        if (req.user.role !== 'parent') {
            return res.status(403).json({
                success: false,
                message: 'Only parents can transfer funds'
            });
        }

        // Validate amount
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid transfer amount'
            });
        }

        // Get parent
        const parent = await User.findById(req.user._id);

        // Check if parent has sufficient balance
        if (parent.balance < amount) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient balance'
            });
        }

        // Get child and verify relationship
        const child = await User.findById(childId);
        if (!child || child.role !== 'child') {
            return res.status(404).json({
                success: false,
                message: 'Child not found'
            });
        }

        if (child.parentId.toString() !== parent._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You can only transfer to your own children'
            });
        }

        // Perform transfer
        parent.balance -= parseFloat(amount);
        child.balance += parseFloat(amount);

        await parent.save();
        await child.save();

        // Create transaction record
        const transaction = new Transaction({
            type: 'transfer',
            amount: parseFloat(amount),
            senderId: parent._id,
            receiverId: child._id,
            description: `Allowance transfer to ${child.username}`
        });
        await transaction.save();

        res.json({
            success: true,
            message: 'Transfer successful',
            parentBalance: parent.balance,
            childBalance: child.balance,
            transaction: {
                id: transaction._id,
                type: transaction.type,
                amount: transaction.amount,
                timestamp: transaction.timestamp
            }
        });
    } catch (error) {
        console.error('Transfer error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error processing transfer'
        });
    }
});

module.exports = router;
