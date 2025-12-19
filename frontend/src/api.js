import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
    createChild: (data) => api.post('/child/create-child', data)
};

// Wallet API
export const walletAPI = {
    getBalance: () => api.get('/wallet/balance'),
    deposit: (amount) => api.post('/wallet/deposit', { amount }),
    transfer: (childId, amount) => api.post('/wallet/transfer', { childId, amount })
};

// Analytics API
export const analyticsAPI = {
    getForecast: () => api.get('/calculator/forecast'),
    getBudget: () => api.get('/analytics/budget'),
    getMonthlyBreakdown: () => api.get('/analytics/monthly-breakdown')
};

// Transaction API
export const transactionAPI = {
    getHistory: (type) => api.get(`/transactions${type ? `?type=${type}` : ''}`),
    getAll: (type) => api.get(`/transactions${type ? `?type=${type}` : ''}`),
    addExpense: (data) => api.post('/transactions/expense', data)
};

export default api;
