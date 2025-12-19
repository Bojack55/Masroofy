import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { transactionsAPI } from '../api';

/**
 * ChildTransactionModal - Shows a specific child's transaction history
 * Uses React Portal to render at document.body level (fixes z-index issues)
 */
function ChildTransactionModal({ isOpen, onClose, child }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const lastChildId = useRef(null);

    useEffect(() => {
        const childId = child?.id || child?._id;

        if (isOpen && childId && childId !== lastChildId.current) {
            lastChildId.current = childId;
            fetchChildTransactions(childId);
        }

        if (!isOpen) {
            lastChildId.current = null;
        }
    }, [isOpen, child?.id, child?._id]);

    const fetchChildTransactions = async (childId) => {
        setLoading(true);
        setError('');
        try {
            const response = await transactionsAPI.getChildTransactions(childId);
            if (response.data.success) {
                setTransactions(response.data.transactions);
            } else {
                setError(response.data.message || 'Failed to load transactions');
            }
        } catch (err) {
            console.error('Error fetching child transactions:', err);
            setError(err.response?.data?.message || 'Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Use React Portal to render at document.body level
    const modalContent = (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '550px' }}>
                {/* Header */}
                <div className="modal-header">
                    <button className="modal-close" onClick={onClose}>&times;</button>
                    <h2 className="modal-title">📊 {child?.username}'s History</h2>
                    <p className="text-secondary">View all transactions</p>
                </div>

                {/* Balance Card */}
                <div style={{
                    background: 'rgba(0, 0, 0, 0.2)',
                    padding: '1rem 1.25rem',
                    margin: '0 2rem 1.5rem 2rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span className="text-secondary">Current Balance</span>
                    <span style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'var(--success)'
                    }}>
                        {(child?.balance || 0).toFixed(2)} EGP
                    </span>
                </div>

                {/* Transactions Content */}
                <div style={{
                    padding: '0 2rem',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    marginBottom: '1.5rem'
                }}>
                    {loading ? (
                        <div className="flex-center" style={{ padding: '2rem' }}>
                            <div className="spinner"></div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-error">{error}</div>
                    ) : transactions.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '0.5rem', opacity: 0.5 }}>💸</div>
                            <p className="text-secondary">No transactions yet</p>
                        </div>
                    ) : (
                        <>
                            {transactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '12px',
                                        padding: '1rem',
                                        marginBottom: '0.75rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        {/* Icon */}
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.125rem',
                                            background: tx.direction === 'incoming'
                                                ? 'rgba(16, 185, 129, 0.15)'
                                                : 'rgba(239, 68, 68, 0.15)',
                                            border: tx.direction === 'incoming'
                                                ? '1px solid rgba(16, 185, 129, 0.3)'
                                                : '1px solid rgba(239, 68, 68, 0.3)'
                                        }}>
                                            {tx.direction === 'incoming' ? '📥' : '📤'}
                                        </div>
                                        {/* Details */}
                                        <div>
                                            <div style={{
                                                fontSize: '0.9rem',
                                                fontWeight: 600,
                                                marginBottom: '0.125rem'
                                            }}>
                                                {tx.description || tx.type}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                {tx.type === 'transfer'
                                                    ? (tx.direction === 'incoming' ? `From: ${tx.sender}` : `To: ${tx.receiver}`)
                                                    : tx.type
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    {/* Amount & Date */}
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{
                                            fontSize: '1rem',
                                            fontWeight: 700,
                                            color: tx.direction === 'incoming' ? 'var(--success)' : 'var(--danger)'
                                        }}>
                                            {tx.direction === 'incoming' ? '+' : '-'} {tx.amount.toFixed(2)} EGP
                                        </div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                            {tx.date}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div style={{ padding: '0 2rem 2rem 2rem' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={onClose}
                        style={{ width: '100%' }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );

    // Render to document.body using Portal
    return ReactDOM.createPortal(modalContent, document.body);
}

export default ChildTransactionModal;
