/*
 * Omar Samer - 13001857
 * Feature: Transaction History & Audit
 * 
 * Full CRUD for transactions
 * Parents see all family transactions, kids see only theirs
 */

const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// create expense
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { type, amount, description } = req.body;

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
            const user = await User.findById(req.user._id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            if (user.balance < parsedAmount) {
                return res.status(400).json({
                    success: false,
                    message: 'Insufficient balance'
                });
            }

            const transaction = await Transaction.create({
                type: 'expense',
                amount: parsedAmount,
                senderId: user._id,
                receiverId: null,
                description: description || 'Expense',
                timestamp: new Date()
            });

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

// get all transactions
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { type } = req.query;
        let query = {};

        if (req.user.role === 'parent') {
            // parents see everything in the family
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
            // kids only see their own
            query = {
                $or: [
                    { senderId: req.user._id },
                    { receiverId: req.user._id }
                ]
            };
        }

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

// get one transaction
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id)
            .populate('senderId', 'username')
            .populate('receiverId', 'username');

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        res.json({ success: true, transaction });
    } catch (error) {
        console.error('Get transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching transaction'
        });
    }
});

// update transaction
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { description } = req.body;

        const transaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            { description },
            { new: true }
        );

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        res.json({
            success: true,
            message: 'Transaction updated',
            transaction
        });
    } catch (error) {
        console.error('Update transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating transaction'
        });
    }
});

// delete transaction
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const transaction = await Transaction.findByIdAndDelete(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        res.json({
            success: true,
            message: 'Transaction deleted'
        });
    } catch (error) {
        console.error('Delete transaction error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting transaction'
        });
    }
});

module.exports = router;

/*
 * POSTMAN:
 * POST /api/transactions - { "type": "expense", "amount": 50, "description": "lunch" }
 * GET /api/transactions
 * GET /api/transactions?type=expense
 * GET /api/transactions/:id
 * PUT /api/transactions/:id - { "description": "updated" }
 * DELETE /api/transactions/:id
 */
