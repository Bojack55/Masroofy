const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Get Transaction History (Protected)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { type } = req.query; // 'income' or 'expense' filter
        let query = {};

        if (req.user.role === 'parent') {
            // For parents: show their transactions and their children's transactions
            const parent = await User.findById(req.user._id).populate('children');
            const childrenIds = parent.children.map(child => child._id);

            query = {
                $or: [
                    { senderId: req.user._id },
                    { receiverId: req.user._id },
                    { senderId: { $in: childrenIds } },
                    { receiverId: { $in: childrenIds } }
                ]
            };
        } else {
            // For children: show only their own transactions
            query = {
                $or: [
                    { senderId: req.user._id },
                    { receiverId: req.user._id }
                ]
            };
        }

        // Apply type filter if provided
        if (type === 'income') {
            query.receiverId = req.user._id;
        } else if (type === 'expense') {
            query.senderId = req.user._id;
        }

        const transactions = await Transaction.find(query)
            .populate('senderId', 'username')
            .populate('receiverId', 'username')
            .sort({ timestamp: -1 })
            .limit(100);

        // Format transactions for frontend
        const formattedTransactions = transactions.map(tx => {
            const isIncoming = tx.receiverId && tx.receiverId._id.toString() === req.user._id.toString();

            return {
                id: tx._id,
                type: tx.type,
                amount: tx.amount,
                direction: isIncoming ? 'incoming' : 'outgoing',
                sender: tx.senderId ? tx.senderId.username : 'External',
                receiver: tx.receiverId ? tx.receiverId.username : 'Unknown',
                description: tx.description,
                timestamp: tx.timestamp,
                date: tx.timestamp.toLocaleDateString(),
                time: tx.timestamp.toLocaleTimeString()
            };
        });

        res.json({
            success: true,
            transactions: formattedTransactions,
            count: formattedTransactions.length
        });
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching transactions'
        });
    }
});

// Create Expense Transaction (Protected)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { type, amount, description } = req.body;

        // Validate input
        if (!type || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Type and amount are required'
            });
        }

        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be a positive number'
            });
        }

        if (type === 'expense') {
            // Get fresh user data from database
            const user = await User.findById(req.user._id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Check if user has enough balance
            if (user.balance < parsedAmount) {
                return res.status(400).json({
                    success: false,
                    message: 'Insufficient balance'
                });
            }

            // Create the expense transaction
            const transaction = await Transaction.create({
                type: 'expense',
                amount: parsedAmount,
                senderId: user._id,
                receiverId: null,
                description: description || 'Expense',
                timestamp: new Date()
            });

            // Deduct balance from user using atomic update
            const updatedUser = await User.findByIdAndUpdate(
                user._id,
                { $inc: { balance: -parsedAmount } },
                { new: true }
            );

            return res.json({
                success: true,
                message: 'Expense recorded successfully',
                transaction: {
                    id: transaction._id,
                    type: transaction.type,
                    amount: transaction.amount,
                    description: transaction.description,
                    timestamp: transaction.timestamp
                },
                newBalance: updatedUser.balance
            });
        }

        res.status(400).json({
            success: false,
            message: 'Invalid transaction type'
        });
    } catch (error) {
        console.error('Create transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating transaction'
        });
    }
});

module.exports = router;
