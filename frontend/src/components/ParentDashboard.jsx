import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, walletAPI } from '../api';
import TopUpModal from './TopUpModal';
import TransferModal from './TransferModal';
import AddChildModal from './AddChildModal';
import TransactionHistory from './TransactionHistory';

function ParentDashboard() {
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState(0);
    const [children, setChildren] = useState([]);
    const [showTopUp, setShowTopUp] = useState(false);
    const [showTransfer, setShowTransfer] = useState(false);
    const [showAddChild, setShowAddChild] = useState(false);
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
            setChildren(profileRes.data.user.children || []);
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
                    <p className="text-secondary" style={{ marginTop: '1rem' }}>Loading your dashboard...</p>
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
                            💰 Masroofy
                        </h1>
                        <div className="flex gap-md" style={{ alignItems: 'center' }}>
                            <div className="text-secondary" style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>Welcome back</div>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user?.username}</div>
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
                            💳 Available Balance
                        </p>
                        <div className="balance-amount">
                            ${balance.toFixed(2)}
                        </div>
                        <p className="text-muted" style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                            Egyptian Pounds
                        </p>

                        {/* Action Buttons */}
                        <div className="action-buttons">
                            <button onClick={() => setShowTopUp(true)} className="btn btn-primary">
                                <span>💳</span> Top Up Wallet
                            </button>
                            <button onClick={() => setShowTransfer(true)} className="btn btn-success">
                                <span>💸</span> Transfer to Child
                            </button>
                            <button onClick={() => setShowAddChild(true)} className="btn btn-secondary">
                                <span>👶</span> Add Child
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="stats-grid">
                    <div className="stat-card slide-in">
                        <div className="stat-label">Total Children</div>
                        <div className="stat-value">{children.length}</div>
                    </div>
                    <div className="stat-card slide-in" style={{ animationDelay: '0.1s' }}>
                        <div className="stat-label">Monthly Transfers</div>
                        <div className="stat-value" style={{ color: 'var(--success)' }}>
                            ${children.reduce((sum, c) => sum + (c.balance || 0), 0).toFixed(2)}
                        </div>
                    </div>
                </div>

                {/* Children Section */}
                <div className="card card-glass" style={{ marginBottom: '2rem' }}>
                    <div className="section-header">
                        <span className="section-icon">👨‍👧‍👦</span>
                        <h3 className="section-title">Your Children</h3>
                    </div>

                    {children.length === 0 ? (
                        <div className="text-center" style={{ padding: '3rem 1rem' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>👶</div>
                            <p className="text-secondary" style={{ marginBottom: '1rem' }}>No children added yet</p>
                            <button onClick={() => setShowAddChild(true)} className="btn btn-primary">
                                Add Your First Child
                            </button>
                        </div>
                    ) : (
                        <div className="children-grid">
                            {children.map((child, index) => (
                                <div
                                    key={child._id}
                                    className="child-card slide-in"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: 'var(--primary-gradient)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.25rem'
                                        }}>
                                            👤
                                        </div>
                                        <h4 className="child-name">{child.username}</h4>
                                    </div>
                                    <div className="child-balance">
                                        ${(child.balance || 0).toFixed(2)}
                                    </div>
                                    <p className="text-muted" style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                                        Current Balance
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Transaction History Section */}
                <div className="card card-glass slide-in">
                    <TransactionHistory />
                </div>
            </main>

            {/* Modals */}
            {showTopUp && (
                <TopUpModal
                    onClose={() => setShowTopUp(false)}
                    onSuccess={() => {
                        setShowTopUp(false);
                        fetchData();
                    }}
                />
            )}
            {showTransfer && (
                <TransferModal
                    children={children}
                    parentBalance={balance}
                    onClose={() => setShowTransfer(false)}
                    onSuccess={() => {
                        setShowTransfer(false);
                        fetchData();
                    }}
                />
            )}
            {showAddChild && (
                <AddChildModal
                    onClose={() => setShowAddChild(false)}
                    onSuccess={() => {
                        setShowAddChild(false);
                        fetchData();
                    }}
                />
            )}
        </div>
    );
}

export default ParentDashboard;
