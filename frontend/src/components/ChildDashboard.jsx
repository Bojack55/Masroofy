import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, walletAPI } from '../api';
import DailyCalculator from './DailyCalculator';
import BudgetTracker from './BudgetTracker';
import TransactionHistory from './TransactionHistory';
import ExpenseModal from './ExpenseModal';

function ChildDashboard() {
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState(0);
    const [showExpense, setShowExpense] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [profileRes, balanceRes] = await Promise.all([
                authAPI.getProfile(),
                walletAPI.getBalance()
            ]);

            setUser(profileRes.data.user);
            setBalance(balanceRes.data.balance);
        } catch (error) {
            console.error('Error fetching data:', error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh' }}>
                <div className="text-center">
                    <div className="spinner"></div>
                    <p className="text-secondary" style={{ marginTop: '1rem' }}>Loading your wallet...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard fade-in">
            {/* Enhanced Header */}
            <header className="dashboard-header">
                <div className="container">
                    <div className="flex-between">
                        <h1 className="dashboard-title">
                            🎒 My Wallet
                        </h1>
                        <div className="flex gap-md" style={{ alignItems: 'center' }}>
                            <div className="text-secondary" style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>Hello</div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user?.username} 👋</div>
                            </div>
                            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container" style={{ padding: '2.5rem 2rem' }}>
                {/* Hero Balance Card */}
                <div className="balance-card slide-in" style={{ marginBottom: '2.5rem' }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <p className="text-secondary" style={{ fontSize: '0.9375rem', marginBottom: '0.5rem', fontWeight: 500 }}>
                            🏦 My Balance
                        </p>
                        <div className="balance-amount">
                            ${balance.toFixed(2)}
                        </div>
                        <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                            Egyptian Pounds
                        </p>

                        {/* Action Button */}
                        <div className="action-buttons">
                            <button
                                onClick={() => setShowExpense(true)}
                                className="btn btn-warning"
                            >
                                <span>💸</span> Record Expense
                            </button>
                        </div>
                    </div>
                </div>

                {/* Smart Tools Grid */}
                <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                    <div className="slide-in">
                        <DailyCalculator balance={balance} />
                    </div>
                    <div className="slide-in" style={{ animationDelay: '0.1s' }}>
                        <BudgetTracker />
                    </div>
                </div>

                {/* Transaction History Section */}
                <div className="card card-glass slide-in" style={{ animationDelay: '0.2s' }}>
                    <TransactionHistory />
                </div>
            </main>

            {/* Expense Modal */}
            {showExpense && (
                <ExpenseModal
                    onClose={() => setShowExpense(false)}
                    onSuccess={() => {
                        setShowExpense(false);
                        fetchData();
                    }}
                />
            )}
        </div>
    );
}

export default ChildDashboard;
