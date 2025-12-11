import React, { useState } from 'react';
import { authAPI } from '../api';

function AddChildModal({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await authAPI.createChild({
                username: formData.username,
                password: formData.password
            });

            if (response.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 1500);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create child account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <button className="modal-close" onClick={onClose}>&times;</button>
                    <h2 className="modal-title">👶 Add Child Account</h2>
                    <p className="text-secondary">Create a new account for your child</p>
                </div>

                {success ? (
                    <div className="text-center" style={{ padding: '2rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                        <h3 style={{ color: 'var(--success)' }}>Child Account Created!</h3>
                        <p className="text-secondary">Account is ready to use</p>
                    </div>
                ) : (
                    <>
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
                                    placeholder="Choose a username for your child"
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

                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="form-input"
                                    placeholder="Re-enter password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="alert alert-warning" style={{ fontSize: '0.875rem' }}>
                                💡 Make sure to save the username and password. Your child will use these to login.
                            </div>

                            <div className="flex gap-md">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="btn btn-secondary"
                                    style={{ flex: 1 }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ flex: 1 }}
                                    disabled={loading}
                                >
                                    {loading ? 'Creating...' : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default AddChildModal;
