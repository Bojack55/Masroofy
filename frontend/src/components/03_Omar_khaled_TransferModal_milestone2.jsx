import React, { useState } from 'react';
import { walletAPI } from '../api';

function TransferModal({ onClose, onSuccess, children, parentBalance }) {
    const [childId, setChildId] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!childId) {
            setError('Please select a child');
            return;
        }

        if (parseFloat(amount) <= 0) {
            setError('Amount must be greater than 0');
            return;
        }

        if (parseFloat(amount) > parentBalance) {
            setError('Insufficient balance');
            return;
        }

        setLoading(true);

        try {
            const response = await walletAPI.transfer({ childId: childId, amount: parseFloat(amount) });

            if (response.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Transfer failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const selectedChild = children.find(c => c._id === childId);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="modal-close" onClick={onClose}>&times;</button>
                    <h2 className="modal-title">💸 Transfer to Child</h2>
                    <p className="text-secondary">Send allowance to your child</p>
                </div>

                {success ? (
                    <div className="text-center" style={{ padding: '2rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                        <h3 style={{ color: 'var(--success)' }}>Transfer Successful!</h3>
                        <p className="text-secondary">Allowance sent successfully</p>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="alert alert-error">
                                {error}
                            </div>
                        )}

                        <div className="card" style={{ background: 'var(--bg-dark)', padding: '1rem', marginBottom: '1.5rem' }}>
                            <div className="flex-between">
                                <span className="text-secondary">Your Available Balance</span>
                                <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)' }}>
                                    {parentBalance.toFixed(2)} EGP
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Select Child</label>
                                <select
                                    className="form-select"
                                    value={childId}
                                    onChange={(e) => setChildId(e.target.value)}
                                    required
                                >
                                    <option value="">Choose a child...</option>
                                    {children.map((child) => (
                                        <option key={child._id} value={child._id}>
                                            {child.username} (Balance: {child.balance.toFixed(2)} EGP)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Amount (EGP)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="Enter amount to transfer"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    step="0.01"
                                    min="0.01"
                                    max={parentBalance}
                                    required
                                />
                            </div>

                            {selectedChild && amount && parseFloat(amount) > 0 && (
                                <div className="card" style={{ background: 'var(--success-gradient)', padding: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ color: 'white', textAlign: 'center' }}>
                                        <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.25rem' }}>
                                            New balance for {selectedChild.username}
                                        </div>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                                            {(selectedChild.balance + parseFloat(amount)).toFixed(2)} EGP
                                        </div>
                                    </div>
                                </div>
                            )}

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
                                    className="btn btn-primary"
                                    style={{ flex: 1 }}
                                    disabled={loading || parseFloat(amount) > parentBalance}
                                >
                                    {loading ? 'Transferring...' : 'Send Money'}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default TransferModal;
