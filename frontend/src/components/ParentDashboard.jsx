import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, walletAPI } from '../api';
import TopUpModal from './03_Omar_khaled_TopUpModal_milestone2';
import TransferModal from './03_Omar_khaled_TransferModal_milestone2';
import ExpenseModal from './04_omar_samer_ExpenseModal_milestone2';
import TransactionHistory from './04_omar_samer_TransactionHistory_milestone2';
import ChildAccounts from './06_bahaa_ahmed_ChildAccounts';

function ParentDashboard() {
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState(0);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showTopUpModal, setShowTopUpModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const [profileRes, balanceRes, childrenRes] = await Promise.all([
                authAPI.profile(),
                walletAPI.getBalance(),
                authAPI.getChildren()
            ]);
            setUser(profileRes.data.user);
            setBalance(balanceRes.data.balance || 0);
            setChildren(childrenRes.data.children || []);
        } catch (error) {
            console.error('Error fetching user data:', error);
            if (error.response?.status === 401) {
                logout();
            }
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const refreshData = () => {
        fetchUserData();
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh' }}>
                <div className="card">
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                    <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard fade-in">
            <div className="dashboard-header">
                <h1 className="dashboard-title">💰 Parent Dashboard</h1>
                <button className="btn btn-primary" onClick={logout}>
                    <span style={{ position: 'relative', zIndex: 1 }}>Logout</span>
                </button>
            </div>

            {/* Balance Card */}
            <div className="balance-card">
                <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Total Balance</p>
                <h2 className="balance-amount">EGP {balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                <p style={{ opacity: 0.85, fontSize: '1.1rem' }}>Welcome back, {user?.username}! 👋</p>
            </div>

            {/* Quick Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👶</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--primary)' }}>
                        {children.length}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Child Account{children.length !== 1 ? 's' : ''}
                    </div>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💳</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--success)' }}>
                        EGP {balance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Available Funds
                    </div>
                </div>
            </div>

            {/* Action Cards */}
            <div className="action-cards-grid">
                <div className="card card-clickable action-card" onClick={() => setShowTopUpModal(true)}>
                    <div className="action-card-icon">💳</div>
                    <h3>Top Up Wallet</h3>
                    <p className="text-secondary">Add funds to your account</p>
                    <button className="btn btn-primary btn-sm" style={{ marginTop: '1rem', position: 'relative', zIndex: 0 }}>
                        <span style={{ position: 'relative', zIndex: 1 }}>Add Funds</span>
                    </button>
                </div>

                <div className="card card-clickable action-card" onClick={() => setShowTransferModal(true)}>
                    <div className="action-card-icon">💸</div>
                    <h3>Transfer to Child</h3>
                    <p className="text-secondary">Send allowance to your children</p>
                    <button className="btn btn-primary btn-sm" style={{ marginTop: '1rem', position: 'relative', zIndex: 0 }}>
                        <span style={{ position: 'relative', zIndex: 1 }}>Send Money</span>
                    </button>
                </div>

                <div className="card card-clickable action-card" onClick={() => setShowExpenseModal(true)}>
                    <div className="action-card-icon">🧾</div>
                    <h3>Record Expense</h3>
                    <p className="text-secondary">Track where your money goes</p>
                    <button className="btn btn-primary btn-sm" style={{ marginTop: '1rem', position: 'relative', zIndex: 0 }}>
                        <span style={{ position: 'relative', zIndex: 1 }}>Add Expense</span>
                    </button>
                </div>
            </div>

            {/* Child Accounts Section */}
            <div className="card" style={{ marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>👨‍👩‍👧‍👦</span>
                    <span>Child Accounts</span>
                </h2>
                <ChildAccounts />
            </div>

            {/* Transaction History */}
            <div className="card">
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>📜</span>
                    <span>Transaction History</span>
                </h2>
                <TransactionHistory />
            </div>

            {/* Modals */}
            {showTopUpModal && (
                <TopUpModal
                    onClose={() => setShowTopUpModal(false)}
                    onSuccess={refreshData}
                />
            )}
            {showTransferModal && children.length > 0 && (
                <TransferModal
                    onClose={() => setShowTransferModal(false)}
                    onSuccess={refreshData}
                    children={children}
                    parentBalance={balance}
                />
            )}
            {showExpenseModal && (
                <ExpenseModal
                    isOpen={showExpenseModal}
                    onClose={() => setShowExpenseModal(false)}
                    onSuccess={refreshData}
                />
            )}
            {showTransferModal && children.length === 0 && (
                <div className="modal-overlay" onClick={() => setShowTransferModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <button className="modal-close" onClick={() => setShowTransferModal(false)}>&times;</button>
                            <h2 className="modal-title">No Children Yet</h2>
                        </div>
                        <div className="empty-state">
                            <div className="empty-state-icon">👶</div>
                            <h3 className="empty-state-title">Create a Child Account First</h3>
                            <p className="empty-state-description">
                                You need to add at least one child account before you can transfer funds.
                            </p>
                            <button className="btn btn-primary" onClick={() => setShowTransferModal(false)}>
                                <span style={{ position: 'relative', zIndex: 1 }}>Got it</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ParentDashboard;
