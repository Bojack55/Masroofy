const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['deposit', 'transfer', 'expense'],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    description: {
        type: String,
        default: ''
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
transactionSchema.index({ receiverId: 1, timestamp: -1 });
transactionSchema.index({ senderId: 1, timestamp: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
