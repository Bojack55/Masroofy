import React, { useState } from 'react';
import { authAPI } from '../api';

function AddChildModal({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await authAPI.createChild(formData);
            if (response.data.success) {
                onSuccess();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create child account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="card card-glass modal-content fade-in" onClick={(e) => e.stopPropagation()}>
                <h2 style={{ marginBottom: '1.5rem' }}>👶 Add Child Account</h2>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Child's Username</label>
                        <input
                            type="text"
                            name="username"
                            className="form-input"
                            placeholder="Enter username for child"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder="At least 6 characters"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Child Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddChildModal;
