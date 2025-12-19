import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, walletAPI } from '../api';
<<<<<<< HEAD
import DailyCalculator from './05_omar_mahmoud_DailyCalculator_milestone2';
import BudgetTracker from './02_eyad_ahmed_BudgetTracker_milestone2';
import TransactionHistory from './04_omar_samer_TransactionHistory_milestone2';
import ExpenseModal from './04_omar_samer_ExpenseModal_milestone2';
=======
import DailyCalculator from './DailyCalculator';
import BudgetTracker from './BudgetTracker';
import TransactionHistory from './TransactionHistory';
import ExpenseModal from './ExpenseModal';
>>>>>>> c0c226a7416b24488a3fbdd83b02125a23d27910

function ChildDashboard() {
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState(0);
<<<<<<< HEAD
    const [loading, setLoading] = useState(true);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const [profileRes, balanceRes] = await Promise.all([
                authAPI.profile(),
                walletAPI.getBalance()
            ]);
            setUser(profileRes.data.user);
            setBalance(balanceRes.data.balance || 0);
        } catch (error) {
            console.error('Error fetching user data:', error);
            if (error.response?.status === 401) {
                logout();
=======
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
>>>>>>> c0c226a7416b24488a3fbdd83b02125a23d27910
            }
        } finally {
            setLoading(false);
        }
    };

<<<<<<< HEAD
    const logout = () => {
=======
    const handleLogout = () => {
>>>>>>> c0c226a7416b24488a3fbdd83b02125a23d27910
        localStorage.clear();
        navigate('/login');
    };

<<<<<<< HEAD
    const refreshData = () => {
        fetchUserData();
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh' }}>
                <div className="card">
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                    <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading your dashboard...</p>
=======
    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh' }}>
                <div className="text-center">
                    <div className="spinner"></div>
                    <p className="text-secondary" style={{ marginTop: '1rem' }}>Loading your wallet...</p>
>>>>>>> c0c226a7416b24488a3fbdd83b02125a23d27910
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard fade-in">
<<<<<<< HEAD
            <div className="dashboard-header">
                <h1 className="dashboard-title">👶 My Allowance</h1>
                <button className="btn btn-primary" onClick={logout}>
                    <span style={{ position: 'relative', zIndex: 1 }}>Logout</span>
                </button>
            </div>

            {/* Balance Card */}
            <div className="balance-card">
                <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>My Current Balance</p>
                <h2 className="balance-amount">EGP {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                <p style={{ opacity: 0.85, fontSize: '1.1rem' }}>Hi, {user?.username}! 👋</p>
            </div>

            {/* Record Expense Card */}
            <div className="card card-clickable" onClick={() => setShowExpenseModal(true)} style={{ marginBottom: '2rem', textAlign: 'center', padding: '1.5rem', cursor: 'pointer' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💸</div>
                <h3 style={{ marginBottom: '0.5rem' }}>Record Expense</h3>
                <p className="text-secondary">Track your spending</p>
                <button className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                    <span style={{ position: 'relative', zIndex: 1 }}>Add Expense</span>
                </button>
            </div>

            {/* Tools Section */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card">
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>📅</span>
                        <span>Daily Calculator</span>
                    </h3>
                    <DailyCalculator />
                </div>
                <div className="card">
                    <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>🎯</span>
                        <span>Budget Tracker</span>
                    </h3>
                    <BudgetTracker />
                </div>
            </div>

            {/* Transaction History */}
            <div className="card">
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>💳</span>
                    <span>My Transactions</span>
                </h2>
                <TransactionHistory />
            </div>

            {/* Expense Modal */}
            {showExpenseModal && (
                <ExpenseModal
                    isOpen={showExpenseModal}
                    onClose={() => setShowExpenseModal(false)}
                    onSuccess={refreshData}
=======
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
>>>>>>> c0c226a7416b24488a3fbdd83b02125a23d27910
                />
            )}
        </div>
    );
}

export default ChildDashboard;
