# 🚀 Quick Start Guide

## Prerequisites Check
- ✅ Backend dependencies installed
- ✅ Frontend dependencies installed
- ⚠️ MongoDB needs to be running

## Step 1: Start MongoDB

### Option A: Local MongoDB
```bash
# Start MongoDB service
mongod
```

### Option B: MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `backend/.env` with your connection string

---

## Step 2: Start Backend Server

**Open Terminal 1:**
```bash
cd "c:\Users\Eyad\Desktop\EBD Proj\backend"
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm run dev
```

**Expected Output:**
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
📍 API available at http://localhost:5000/api
```

**Test Backend:**
Open browser: `http://localhost:5000/api/health`
Should see: `{"success": true, "message": "Wallet API is running"}`

---

## Step 3: Start Frontend

**Open Terminal 2:**
```bash
cd "c:\Users\Eyad\Desktop\EBD Proj\frontend"
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view wallet-frontend in the browser.

Local:            http://localhost:3000
On Your Network:  http://192.168.x.x:3000
```

Browser will automatically open to `http://localhost:3000`

---

## Step 4: Test the Application

### Create Parent Account
1. Click "Register as Parent"
2. Fill in:
   - Username: `parent1`
   - Email: `parent@example.com`
   - Password: `password123`
3. Click "Create Account"

### Top Up Wallet
1. Click "💳 Top Up Wallet"
2. Enter amount: `1000`
3. Fill card details (visual only):
   - Card: `1234 5678 9012 3456`
   - CVV: `123`
4. Click "Confirm Deposit"

### Create Child Account
1. Click "+ Add Child"
2. Fill in:
   - Username: `child1`
   - Password: `password123`
3. Click "Create Account"

### Transfer Allowance
1. Click "💸 Transfer to Child"
2. Select `child1` from dropdown
3. Enter amount: `200`
4. Click "Send Money"

### Test Child Dashboard
1. **Logout** from parent account
2. **Login** as child:
   - Username: `child1`
   - Password: `password123`
3. View:
   - ✅ Balance: 200 EGP
   - ✅ Daily Calculator showing safe daily spend
   - ✅ Budget Tracker with progress bar
   - ✅ Transaction history

---

## 🔧 Troubleshooting

### Backend won't start
**Problem:** MongoDB connection error
**Solution:** Make sure MongoDB is running
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
mongod
```

### Frontend won't start
**Problem:** Port 3000 already in use
**Solution:** 
- Close other apps using port 3000
- Or change port in `frontend/package.json`

### "Cannot load npm.ps1"
**Problem:** PowerShell execution policy
**Solution:** Run this first in your terminal:
```bash
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

### API calls failing
**Problem:** Backend not running or wrong URL
**Solution:** 
- Verify backend is running on port 5000
- Check `frontend/src/api.js` has correct API_URL

---

## 📊 API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register parent
- `POST /api/auth/login` - Login
- `POST /api/auth/create-child` - Create child
- `GET /api/auth/profile` - Get profile

### Wallet
- `GET /api/wallet/balance` - Get balance
- `POST /api/wallet/deposit` - Deposit funds
- `POST /api/wallet/transfer` - Transfer to child

### Analytics
- `GET /api/analytics/forecast` - Daily spend calculator
- `GET /api/analytics/budget` - Budget tracker

### Transactions
- `GET /api/transactions` - Get history
- `GET /api/transactions?type=income` - Filter income
- `GET /api/transactions?type=expense` - Filter expenses

---

## 🎯 Demo Credentials

After following the setup above, you can use:

**Parent:**
- Username: `parent1`
- Password: `password123`

**Child:**
- Username: `child1`
- Password: `password123`

---

## 🌟 What to Test

✅ **Feature 1:** Register → Login → Create Child  
✅ **Feature 2:** Top Up Wallet  
✅ **Feature 3:** Transfer to Child  
✅ **Feature 4:** Daily Calculator (child dashboard)  
✅ **Feature 5:** Budget Tracker (child dashboard)  
✅ **Feature 6:** Transaction History (both dashboards)

---

## 🎨 UI Features to Notice

- **Gradient backgrounds** on balance cards
- **Smooth animations** when modals open
- **Color-coded progress bar** in budget tracker
- **Real-time updates** after transactions
- **Responsive design** - resize your browser!
- **Hover effects** on cards and buttons

---

**Need Help?** Check the [README.md](file:///c:/Users/Eyad/Desktop/EBD%20Proj/README.md) for detailed documentation.
