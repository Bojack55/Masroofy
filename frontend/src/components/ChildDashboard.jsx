import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { walletAPI, analyticsAPI } from '../api';
import DailyCalculator from './DailyCalculator';
import BudgetTracker from './BudgetTracker';
import TransactionHistory from './TransactionHistory';
import ExpenseModal from './ExpenseModal';

function ChildDashboard() {
    const [balance, setBalance] = useState(0);
    const [showExpense, setShowExpense] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    const fetchData = async () => {
        try {
            const balanceRes = await walletAPI.getBalance();

            if (balanceRes.data.success) {
                setBalance(balanceRes.data.balance);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
            {/* Header */}
            <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border)', padding: '1.5rem 0' }}>
                <div className="container">
                    <div className="flex-between">
                        <div>
                            <h2 style={{ marginBottom: '0.25rem' }}>My Wallet</h2>
                            <p className="text-secondary">Welcome, {username}! 🎉</p>
                        </div>
                        <button onClick={handleLogout} className="btn btn-secondary">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                {/* Balance Card */}
                <div className="balance-display fade-in">
                    <div className="balance-label">Available Balance</div>
                    <div className="balance-amount">{balance.toFixed(2)} EGP</div>
                    <div className="flex-center gap-md" style={{ marginTop: '1.5rem' }}>
                        <button onClick={() => setShowExpense(true)} className="btn btn-primary">
                            🧾 Record Expense
                        </button>
                    </div>
                </div>

                <div className="grid grid-2 gap-lg">
                    {/* Daily Calculator Widget */}
                    <div className="card slide-in">
                        <DailyCalculator refreshKey={refreshKey} />
                    </div>

                    {/* Budget Tracker Widget */}
                    <div className="card slide-in">
                        <BudgetTracker refreshKey={refreshKey} />
                    </div>
                </div>

                {/* Transaction History */}
                <div className="card slide-in" style={{ marginTop: '2rem' }}>
                    <TransactionHistory onRefresh={handleRefresh} />
                </div>
            </div>

            {/* Expense Modal */}
            {showExpense && (
                <ExpenseModal
                    isOpen={showExpense}
                    onClose={() => setShowExpense(false)}
                    onSuccess={handleRefresh}
                />
            )}
        </div>
    );
}

export default ChildDashboard;
