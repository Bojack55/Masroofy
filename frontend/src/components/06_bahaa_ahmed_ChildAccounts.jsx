import React, { useState, useEffect } from 'react';
import { authAPI } from '../api';
import ChildTransactionModal from './ChildTransactionModal';

function ChildAccounts() {
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newChild, setNewChild] = useState({ username: '', password: '' });
    const [creating, setCreating] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedChild, setSelectedChild] = useState(null);

    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        try {
            const res = await authAPI.getChildren();
            if (res.data.success) {
                setChildren(res.data.children || []);
            } else {
                setError(res.data.message || 'Failed to load children');
            }
        } catch (e) {
            console.error(e);
            setError('Server error while loading children');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewChild((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        setError('');
        try {
            const res = await authAPI.createChild(newChild);
            if (res.data.success) {
                setChildren((prev) => [...prev, res.data.child]);
                setNewChild({ username: '', password: '' });
                setShowAddForm(false);
            } else {
                setError(res.data.message || 'Failed to create child');
            }
        } catch (e) {
            console.error(e);
            setError(e.response?.data?.message || 'Server error while creating child');
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ padding: '2rem' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            {error && (
                <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                    {error}
                </div>
            )}

            {/* Children List */}
            {children.length > 0 ? (
                <ul className="children-list">
                    {children.map((child) => (
                        <li
                            key={child.id || child._id}
                            className="child-item"
                            onClick={() => setSelectedChild(child)}
                            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            title="Click to view transactions"
                        >
                            <div className="child-username">
                                {child.username}
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>📊 View History</span>
                            </div>
                            <div className="child-balance">
                                EGP {(child.balance || 0).toFixed(2)}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="empty-state" style={{ padding: '2rem' }}>
                    <div className="empty-state-icon">👶</div>
                    <h3 className="empty-state-title">No Children Added Yet</h3>
                    <p className="empty-state-description">
                        Create child accounts to start managing your family's allowance
                    </p>
                </div>
            )}

            {/* Add Child Button/Form */}
            {!showAddForm ? (
                <button
                    className="btn btn-primary"
                    onClick={() => setShowAddForm(true)}
                    style={{ width: '100%', marginTop: '1rem' }}
                >
                    <span style={{ position: 'relative', zIndex: 1 }}>
                        ➕ Add New Child
                    </span>
                </button>
            ) : (
                <div className="card" style={{ marginTop: '1rem', background: 'rgba(59, 130, 246, 0.05)', border: '1px solid var(--primary)' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>➕ Add New Child</h3>
                    <form onSubmit={handleCreate}>
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="form-input"
                                placeholder="Enter child's username"
                                value={newChild.username}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                placeholder="Create a password"
                                value={newChild.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setShowAddForm(false);
                                    setNewChild({ username: '', password: '' });
                                    setError('');
                                }}
                                style={{ flex: 1 }}
                            >
                                <span style={{ position: 'relative', zIndex: 1 }}>Cancel</span>
                            </button>
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={creating}
                                style={{ flex: 1 }}
                            >
                                <span style={{ position: 'relative', zIndex: 1 }}>
                                    {creating ? 'Creating...' : 'Create Child'}
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Child Transaction Modal */}
            <ChildTransactionModal
                isOpen={!!selectedChild}
                onClose={() => setSelectedChild(null)}
                child={selectedChild}
            />
        </div>
    );
}

export default ChildAccounts;
