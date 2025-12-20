import React, { useState } from 'react';
import { transactionAPI } from '../api';

/**
 * ExpenseModal – Premium modal for recording expenses
 * Used by both ParentDashboard and ChildDashboard
 */
const ExpenseModal = ({ isOpen, onClose, onSuccess }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount greater than 0');
            return;
        }
        if (!description.trim()) {
            setError('Please provide a purpose/description for this expense');
            return;
        }

        setLoading(true);
        try {
            const payload = {
                type: 'expense',
                amount: parseFloat(amount),
                description: description.trim(),
            };
            await transactionAPI.createExpense(payload);

            // Success - close modal and refresh parent
            if (onSuccess) onSuccess();
            setAmount('');
            setDescription('');
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to record expense');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="modal-close" onClick={onClose}>&times;</button>
                    <h2 className="modal-title">💸 Record Expense</h2>
                    <p className="text-secondary">Track where your money goes</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Amount (EGP)</label>
                        <input
                            type="number"
                            className="form-input"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            step="0.01"
                            min="0.01"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Purpose / Description</label>
                        <textarea
                            className="form-input"
                            placeholder="What did you buy? (e.g., lunch, books, transportation)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                            required
                            disabled={loading}
                            style={{ resize: 'vertical', fontFamily: 'inherit' }}
                        />
                        <p className="text-secondary" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                            This helps you track your spending habits
                        </p>
                    </div>

                    <div className="flex gap-md">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                            style={{ flex: 1 }}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ flex: 1 }}
                            disabled={loading}
                        >
                            {loading ? '💫 Saving...' : '✅ Save Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExpenseModal;
