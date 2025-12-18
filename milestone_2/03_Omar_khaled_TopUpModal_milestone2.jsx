import React, { useState } from 'react';
import { walletAPI } from '../api';

function TopUpModal({ onClose, onSuccess }) {
    const [amount, setAmount] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cvv, setCvv] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (parseFloat(amount) <= 0) {
            setError('Amount must be greater than 0');
            return;
        }

        setLoading(true);

        try {
            const response = await walletAPI.deposit(parseFloat(amount));

            if (response.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Deposit failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="modal-close" onClick={onClose}>&times;</button>
                    <h2 className="modal-title">💳 Top Up Wallet</h2>
                    <p className="text-secondary">Add funds to your account</p>
                </div>

                {success ? (
                    <div className="text-center" style={{ padding: '2rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                        <h3 style={{ color: 'var(--success)' }}>Deposit Successful!</h3>
                        <p className="text-secondary">Your wallet has been updated</p>
                    </div>
                ) : (
                    <>
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
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Card Number (Visual Only)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="1234 5678 9012 3456"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    maxLength="19"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">CVV (Visual Only)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="123"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    maxLength="4"
                                    required
                                />
                            </div>

                            <div className="alert alert-warning" style={{ fontSize: '0.875rem' }}>
                                💡 This is a simulated payment. No real transactions will occur.
                            </div>

                            <div className="flex gap-md">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="btn btn-secondary"
                                    style={{ flex: 1 }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    style={{ flex: 1 }}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Confirm Deposit'}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default TopUpModal;
