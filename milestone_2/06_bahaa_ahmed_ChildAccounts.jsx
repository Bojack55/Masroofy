import React, { useState, useEffect } from 'react';
import { authAPI } from '../api';

/**
 * Milestone 2 – Child Accounts UI for Bahaa
 * This component provides a simple interface for parents to:
 *   • View a list of their children
 *   • Add a new child account
 *   • (Future) edit or delete a child
 *
 * The component is deliberately lightweight – it focuses on the static
 * front‑end experience required for Milestone 2. All network calls are
 * wrapped in `try / catch` blocks and errors are displayed inline.
 */
function ChildAccounts() {
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newChild, setNewChild] = useState({ username: '', password: '' });
    const [creating, setCreating] = useState(false);

    // Fetch children on mount – assumes an endpoint `authAPI.getChildren`
    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const res = await authAPI.getChildren(); // <-- implement in API if missing
                if (res.data.success) {
                    setChildren(res.data.children);
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
        fetchChildren();
    }, []);

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
                // Append the newly created child to the list for instant UI feedback
                setChildren((prev) => [...prev, res.data.child]);
                setNewChild({ username: '', password: '' });
            } else {
                setError(res.data.message || 'Failed to create child');
            }
        } catch (e) {
            console.error(e);
            setError('Server error while creating child');
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return <div className="spinner">Loading children…</div>;
    }

    return (
        <div className="child-accounts container">
            <h2 className="section-title">My Children</h2>
            {error && <p className="error-msg">{error}</p>}

            {/* List of children */}
            <ul className="children-list">
                {children.map((c) => (
                    <li key={c.id} className="child-item">
                        <span className="child-username">{c.username}</span>
                        <span className="child-balance">Balance: {c.balance?.toFixed(2) ?? 0} EGP</span>
                    </li>
                ))}
                {children.length === 0 && <li>No children found.</li>}
            </ul>

            {/* Add new child form */}
            <form className="add-child-form" onSubmit={handleCreate}>
                <h3>Add New Child</h3>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={newChild.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={newChild.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                    {creating ? 'Creating…' : 'Create Child'}
                </button>
            </form>
        </div>
    );
}

export default ChildAccounts;
