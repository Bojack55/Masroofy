import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../api';

function DailyCalculator({ refreshKey = 0 }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchForecast();
    }, [refreshKey]);

    const fetchForecast = async () => {
        try {
            const response = await analyticsAPI.getForecast();
            if (response.data.success) {
                setData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching forecast:', error);
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

    return (
        <div>
            <h3 style={{ marginBottom: '1.5rem' }}>📅 Daily Spending Calculator</h3>

            <div className="card" style={{ background: 'var(--success-gradient)', padding: '1.5rem', border: 'none' }}>
                <div style={{ color: 'white', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        {data?.safeDailySpend.toFixed(2)} EGP
                    </div>
                    <div style={{ fontSize: '1rem', opacity: 0.9 }}>
                        Safe to spend per day
                    </div>
                </div>
            </div>

            <div className="grid grid-2 gap-sm" style={{ marginTop: '1rem' }}>
                <div className="card" style={{ background: 'var(--bg-dark)', padding: '1rem', textAlign: 'center' }}>
                    <div className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        Days Remaining
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {data?.daysRemaining || 0}
                    </div>
                </div>

                <div className="card" style={{ background: 'var(--bg-dark)', padding: '1rem', textAlign: 'center' }}>
                    <div className="text-secondary" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        Current Balance
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)' }}>
                        {data?.currentBalance.toFixed(2)} EGP
                    </div>
                </div>
            </div>

            <div className="alert alert-warning" style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                💡 This calculation helps you budget your allowance until the end of the month!
            </div>
        </div>
    );
}

export default DailyCalculator;
