import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

<<<<<<< HEAD
// Create axios instance
=======
>>>>>>> c0c226a7416b24488a3fbdd83b02125a23d27910
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
<<<<<<< HEAD
    profile: () => api.get('/auth/profile'),
    getChildren: () => api.get('/auth/children'),
    createChild: (data) => api.post('/auth/create-child', data)
=======
    getProfile: () => api.get('/auth/profile'),
    createChild: (data) => api.post('/child/create-child', data)
>>>>>>> c0c226a7416b24488a3fbdd83b02125a23d27910
};

// Wallet API
export const walletAPI = {
    getBalance: () => api.get('/wallet/balance'),
    deposit: (amount) => api.post('/wallet/deposit', { amount }),
<<<<<<< HEAD
    transfer: (data) => api.post('/wallet/transfer', data)
=======
    transfer: (childId, amount) => api.post('/wallet/transfer', { childId, amount })
>>>>>>> c0c226a7416b24488a3fbdd83b02125a23d27910
};

// Analytics API
export const analyticsAPI = {
<<<<<<< HEAD
    getForecast: () => api.get('/analytics/forecast'),
    getBudget: () => api.get('/analytics/budget')
};

// Transactions API
export const transactionsAPI = {
    getAll: (type) => api.get('/transactions', { params: { type } }),
    create: (data) => api.post('/transactions', data),
    createExpense: (data) => api.post('/transactions', data),
    getChildTransactions: (childId) => api.get(`/transactions/child/${childId}`)
};

// Alias for ExpenseModal component compatibility
export const transactionAPI = transactionsAPI;

=======
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

>>>>>>> c0c226a7416b24488a3fbdd83b02125a23d27910
export default api;
