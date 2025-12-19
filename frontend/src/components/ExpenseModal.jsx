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
        <div
            className="modal-overlay"
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.75)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                backdropFilter: 'blur(4px)',
                animation: 'fadeIn 0.2s ease-out'
            }}
        >
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '2rem',
                    maxWidth: '500px',
                    width: '90%',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                    animation: 'slideUp 0.3s ease-out'
                }}
            >
                <div style={{ marginBottom: '1.5rem' }}>
                    <h2 style={{
                        fontSize: '1.75rem',
                        marginBottom: '0.5rem',
                        background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        💸 Record Expense
                    </h2>
                    <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
                        Track where your money goes
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)'
                        }}>
                            Amount (EGP)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="0"
                            step="0.01"
                            placeholder="Enter amount"
                            required
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                fontSize: '1.125rem',
                                fontWeight: 600,
                                border: '2px solid var(--border)',
                                borderRadius: 'var(--radius)',
                                background: 'var(--bg-dark)',
                                color: 'var(--text-primary)',
                                transition: 'all 0.2s',
                                outline: 'none'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '0.5rem',
                            fontWeight: 600,
                            color: 'var(--text-primary)'
                        }}>
                            Purpose / Description *
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                            placeholder="What did you buy? (e.g., lunch, books, transportation)"
                            required
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem',
                                fontSize: '1rem',
                                border: '2px solid var(--border)',
                                borderRadius: 'var(--radius)',
                                background: 'var(--bg-dark)',
                                color: 'var(--text-primary)',
                                resize: 'vertical',
                                transition: 'all 0.2s',
                                outline: 'none',
                                fontFamily: 'inherit'
                            }}
                            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                        />
                        <p className="text-secondary" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                            This helps you track your spending habits
                        </p>
                    </div>

                    {error && (
                        <div
                            style={{
                                padding: '0.75rem 1rem',
                                marginBottom: '1.5rem',
                                background: 'rgba(255, 75, 75, 0.1)',
                                border: '1px solid var(--danger)',
                                borderRadius: 'var(--radius)',
                                color: 'var(--danger)',
                                fontSize: '0.875rem'
                            }}
                        >
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="flex-between gap-md">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                            disabled={loading}
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ flex: 1 }}
                        >
                            {loading ? '💫 Saving...' : '✅ Save Expense'}
                        </button>
                    </div>
                </form>
            </div>

            <style jsx="true">{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default ExpenseModal;
