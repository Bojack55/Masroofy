import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, walletAPI } from '../api';
import TopUpModal from './TopUpModal';
import TransferModal from './TransferModal';
import AddChildModal from './AddChildModal';
import TransactionHistory from './TransactionHistory';
import ExpenseModal from './ExpenseModal';

function ParentDashboard() {
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState(0);
    const [children, setChildren] = useState([]);
    const [showTopUp, setShowTopUp] = useState(false);
    const [showTransfer, setShowTransfer] = useState(false);
    const [showAddChild, setShowAddChild] = useState(false);
    const [showExpense, setShowExpense] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, [refreshKey]);

    const fetchData = async () => {
        try {
            const [profileRes, balanceRes] = await Promise.all([
                authAPI.getProfile(),
                walletAPI.getBalance()
            ]);

            if (profileRes.data.success) {
                setUser(profileRes.data.user);
                setChildren(profileRes.data.user.children || []);
            }

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
                            <h2 style={{ marginBottom: '0.25rem' }}>Parent Dashboard</h2>
                            <p className="text-secondary">Welcome back, {user?.username}! 👋</p>
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
                    <div className="balance-label">Your Balance</div>
                    <div className="balance-amount">{balance.toFixed(2)} EGP</div>
                    <div className="flex-center gap-md" style={{ marginTop: '1.5rem' }}>
                        <button onClick={() => setShowTopUp(true)} className="btn btn-success">
                            💳 Top Up Wallet
                        </button>
                        <button
                            onClick={() => setShowTransfer(true)}
                            className="btn"
                            style={{ background: 'white', color: 'var(--primary)' }}
                            disabled={children.length === 0}
                        >
                            💸 Transfer to Child
                        </button>
                        <button onClick={() => setShowExpense(true)} className="btn btn-primary">
                            🧾 Record Expense
                        </button>
                    </div>
                </div>

                <div className="grid grid-2 gap-lg">
                    {/* Children Section */}
                    <div className="card slide-in">
                        <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
                            <h3>👨‍👩‍👧‍👦 Your Children</h3>
                            <button onClick={() => setShowAddChild(true)} className="btn btn-primary btn-sm">
                                + Add Child
                            </button>
                        </div>

                        {children.length === 0 ? (
                            <div className="text-center" style={{ padding: '2rem' }}>
                                <p className="text-secondary">No children added yet</p>
                                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>Click "Add Child" to create a child account</p>
                            </div>
                        ) : (
                            <div className="flex-col gap-sm">
                                {children.map((child) => (
                                    <div
                                        key={child._id}
                                        className="card"
                                        style={{
                                            background: 'var(--bg-dark)',
                                            padding: '1rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{child.username}</div>
                                            <div className="text-secondary" style={{ fontSize: '0.875rem' }}>Child Account</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                                                {child.balance.toFixed(2)} EGP
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="card slide-in">
                        <h3 style={{ marginBottom: '1.5rem' }}>📊 Quick Stats</h3>
                        <div className="flex-col gap-md">
                            <div className="card" style={{ background: 'var(--bg-dark)', padding: '1rem' }}>
                                <div className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                    Total Children
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: 700 }}>
                                    {children.length}
                                </div>
                            </div>
                            <div className="card" style={{ background: 'var(--bg-dark)', padding: '1rem' }}>
                                <div className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                                    Children's Total Balance
                                </div>
                                <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>
                                    {children.reduce((sum, child) => sum + child.balance, 0).toFixed(2)} EGP
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="card slide-in" style={{ marginTop: '2rem' }}>
                    <TransactionHistory onRefresh={handleRefresh} />
                </div>
            </div>

            {/* Modals */}
            {showTopUp && (
                <TopUpModal
                    onClose={() => setShowTopUp(false)}
                    onSuccess={handleRefresh}
                />
            )}

            {showTransfer && (
                <TransferModal
                    onClose={() => setShowTransfer(false)}
                    onSuccess={handleRefresh}
                    children={children}
                    parentBalance={balance}
                />
            )}

            {showAddChild && (
                <AddChildModal
                    onClose={() => setShowAddChild(false)}
                    onSuccess={handleRefresh}
                />
            )}

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

export default ParentDashboard;
