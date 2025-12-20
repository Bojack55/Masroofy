import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
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
    profile: () => api.get('/auth/profile'),
    getProfile: () => api.get('/auth/profile'),
    getChildren: () => api.get('/auth/children'),
    createChild: (data) => api.post('/auth/create-child', data)
};

// Wallet API
export const walletAPI = {
    getBalance: () => api.get('/wallet/balance'),
    deposit: (amount) => api.post('/wallet/deposit', { amount }),
    transfer: (data) => api.post('/wallet/transfer', data)
};

// Analytics API
export const analyticsAPI = {
    getForecast: () => api.get('/analytics/forecast'),
    getBudget: () => api.get('/analytics/budget'),
    getMonthlyBreakdown: () => api.get('/analytics/monthly-breakdown')
};

// Transactions API
export const transactionsAPI = {
    getAll: (type) => api.get('/transactions', { params: { type } }),
    getHistory: (type) => api.get(`/transactions${type ? `?type=${type}` : ''}`),
    create: (data) => api.post('/transactions', data),
    createExpense: (data) => api.post('/transactions', data),
    addExpense: (data) => api.post('/transactions/expense', data),
    getChildTransactions: (childId) => api.get(`/transactions/child/${childId}`)
};

// Alias for ExpenseModal component compatibility
export const transactionAPI = transactionsAPI;

export default api;
