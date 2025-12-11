import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    createChild: (data) => api.post('/auth/create-child', data),
    getProfile: () => api.get('/auth/profile')
};

// Wallet API
export const walletAPI = {
    getBalance: () => api.get('/wallet/balance'),
    deposit: (amount) => api.post('/wallet/deposit', { amount }),
    transfer: (childId, amount) => api.post('/wallet/transfer', { childId, amount })
};

// Analytics API
export const analyticsAPI = {
    getForecast: () => api.get('/analytics/forecast'),
    getBudget: () => api.get('/analytics/budget')
};

// Transaction API
export const transactionAPI = {
    getAll: (type) => api.get('/transactions', { params: { type } }),
    createExpense: (data) => api.post('/transactions', data)
};

export default api;
