import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../api';

function BudgetTracker({ refreshKey = 0 }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBudget();
    }, [refreshKey]);

    const fetchBudget = async () => {
        try {
            const response = await analyticsAPI.getBudget();
            if (response.data.success) {
                setData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching budget:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ padding: '2rem' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    const getProgressClass = () => {
        if (data.status === 'green') return 'progress-green';
        if (data.status === 'orange') return 'progress-orange';
        return 'progress-red';
    };

    const getStatusEmoji = () => {
        if (data.status === 'green') return '✅';
        if (data.status === 'orange') return '⚠️';
        return '🚨';
    };

    return (
        <div>
            <h3 style={{ marginBottom: '1.5rem' }}>💰 Budget Tracker</h3>

            {data.totalBudget > 0 ? (
                <>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                            <span className="text-secondary">Monthly Budget Usage</span>
                            <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>
                                {data.percentage.toFixed(0)}%
                            </span>
                        </div>
                        <div className="progress-bar">
                            <div
                                className={`progress-bar-fill ${getProgressClass()}`}
                                style={{ width: `${Math.min(data.percentage, 100)}%` }}
                            >
                                {data.percentage >= 20 && `${data.percentage.toFixed(0)}%`}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-2 gap-sm">
                        <div className="card" style={{ background: 'var(--bg-dark)', padding: '1rem' }}>
                            <div className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                Total Budget
                            </div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                                {data.totalBudget.toFixed(2)} EGP
                            </div>
                        </div>

                        <div className="card" style={{ background: 'var(--bg-dark)', padding: '1rem' }}>
                            <div className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                Spent
                            </div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--danger)' }}>
                                {data.spent.toFixed(2)} EGP
                            </div>
                        </div>
                    </div>

                    <div className={`alert alert-${data.status === 'green' ? 'success' : data.status === 'orange' ? 'warning' : 'error'}`} style={{ marginTop: '1rem' }}>
                        <div className="flex-between">
                            <span>{getStatusEmoji()}</span>
                            <span style={{ fontSize: '0.875rem' }}>
                                {data.status === 'green' && "You're doing great! Keep it up!"}
                                {data.status === 'orange' && "Watch your spending carefully!"}
                                {data.status === 'red' && "You've used most of your budget!"}
                            </span>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center" style={{ padding: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                    <p className="text-secondary">No budget data yet</p>
                    <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
                        Ask your parent to send you allowance to start tracking!
                    </p>
                </div>
            )}
        </div>
    );
}

export default BudgetTracker;
