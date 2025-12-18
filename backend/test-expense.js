// Quick test script to verify expense endpoint works
const axios = require('axios');

async function testExpense() {
    try {
        // First, login as a parent
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
            username: 'parentTest',
            password: 'Password123!'
        });

        console.log('✅ Login successful');
        const token = loginRes.data.token;

        // Try to create an expense
        const expenseRes = await axios.post('http://localhost:5000/api/transactions', {
            type: 'expense',
            amount: 50,
            description: 'Test expense'
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('✅ Expense created successfully!');
        console.log('Response:', expenseRes.data);
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testExpense();
