import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../api';

function TransactionHistory() {
    const [transactions, setTransactions] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, [filter]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const filterParam = filter === 'all' ? undefined : filter;
            const response = await transactionAPI.getAll(filterParam);

            if (response.data.success) {
                setTransactions(response.data.transactions);
            }
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTransactionBadge = (direction) => {
        return direction === 'incoming'
            ? <span className="badge badge-success">+ Received</span>
            : <span className="badge badge-danger">- Sent</span>;
    };

    return (
        <div>
            <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                <h3>📜 Transaction History</h3>
                <div className="flex gap-sm">
                    <button
                        className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`btn btn-sm ${filter === 'income' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('income')}
                    >
                        Income
                    </button>
                    <button
                        className={`btn btn-sm ${filter === 'expense' ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setFilter('expense')}
                    >
                        Expenses
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex-center" style={{ padding: '2rem' }}>
                    <div className="spinner"></div>
                </div>
            ) : transactions.length === 0 ? (
                <div className="text-center" style={{ padding: '3rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💸</div>
                    <p className="text-secondary">No transactions yet</p>
                </div>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table className="transaction-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx) => (
                                <tr key={tx.id}>
                                    <td>
                                        <div>{tx.date}</div>
                                        <div className="text-secondary" style={{ fontSize: '0.75rem' }}>
                                            {tx.time}
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ textTransform: 'capitalize' }}>
                                            {tx.type}
                                        </span>
                                    </td>
                                    <td>
                                        <div>{tx.description}</div>
                                        {tx.type === 'transfer' && (
                                            <div className="text-secondary" style={{ fontSize: '0.875rem' }}>
                                                {tx.direction === 'incoming'
                                                    ? `From: ${tx.sender}`
                                                    : `To: ${tx.receiver}`}
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <span style={{
                                            fontWeight: 700,
                                            fontSize: '1.125rem',
                                            color: tx.direction === 'incoming' ? 'var(--success)' : 'var(--text-primary)'
                                        }}>
                                            {tx.direction === 'incoming' ? '+' : '-'} {tx.amount.toFixed(2)} EGP
                                        </span>
                                    </td>
                                    <td>
                                        {getTransactionBadge(tx.direction)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default TransactionHistory;
