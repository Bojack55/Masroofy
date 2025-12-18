# Masroofy - Team Contributions & Code Documentation

## Project Overview
**Masroofy** is a fintech application that links parents with their children to manage pocket money, track spending, and monitor balances. This document provides detailed explanations of each team member's contributions, including the functions, logic, and technologies used.

---

## Technologies Used

| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime for backend server |
| **Express.js** | Web framework for creating REST API routes |
| **MongoDB** | NoSQL database for storing users and transactions |
| **Mongoose** | ODM library for MongoDB interactions |
| **JWT (jsonwebtoken)** | Token-based authentication |
| **bcrypt** | Password hashing for security |
| **React.js** | Frontend library for building UI components |

---

# Team Member Contributions

---

## 01. Moaz Abdelaleem (13007327)
### Feature: User Authentication & Hierarchy

### Files Overview
| Milestone | File | Description |
|-----------|------|-------------|
| M1 | `01_moaz_abdelaleem_auth.js` | Backend authentication route design |
| M2 | `01_moaz_Login_milestone2.jsx` | Login page React component |
| M2 | `01_moaz_Register_milestone2.jsx` | Registration page React component |
| M3 | `01_moaz_authentication_milestone3.js` | Full authentication backend implementation |

### Detailed Code Explanation (Milestone 3)

#### 1. Dependencies & Setup
```javascript
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
```
- **express.Router()**: Creates modular route handlers
- **jwt**: Library for creating/verifying JSON Web Tokens
- **User**: Mongoose model for user data
- **authMiddleware**: Custom middleware to protect routes

#### 2. Register Route (`POST /api/auth/register`)
```javascript
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    
    // Create new user with role 'parent'
    const user = new User({
        username, email, password,
        role: 'parent',
        balance: 0,
        children: []
    });
    
    // Generate JWT token (valid for 7 days)
    const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
});
```
**Key Concepts:**
- `$or` operator: MongoDB query to check multiple conditions
- `jwt.sign()`: Creates a token with user data, secret key, and expiration
- Password is hashed automatically by the User model's pre-save hook

#### 3. Login Route (`POST /api/auth/login`)
```javascript
router.post('/login', async (req, res) => {
    const user = await User.findOne({ username });
    const isMatch = await user.comparePassword(password);
    // Generate token if credentials match
});
```
**Key Concepts:**
- `comparePassword()`: Custom method that uses bcrypt to compare hashed passwords
- Returns JWT token for subsequent authenticated requests

#### 4. Profile Route (`GET /api/auth/profile`)
```javascript
router.get('/profile', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user._id)
        .select('-password')
        .populate('children', 'username balance');
});
```
**Key Concepts:**
- `authMiddleware`: Verifies JWT token before allowing access
- `.select('-password')`: Excludes password from response
- `.populate()`: Replaces ObjectIds with actual child user data

---

## 02. Eyad Ahmed Saeed (13005578)
### Feature: Visual Budget Tracker

### Files Overview
| Milestone | File | Description |
|-----------|------|-------------|
| M1 | `02_eyad_ahmed_budget_tracker.js` | Budget tracking logic design |
| M2 | `02_eyad_ahmed_BudgetTracker_milestone2.jsx` | Budget tracker React component |
| M3 | `02_eyad_ahmed_budget_milestone3.js` | Budget analytics backend |

### Detailed Code Explanation (Milestone 3)

#### 1. Budget Calculation Route (`GET /api/analytics/budget`)
```javascript
router.get('/budget', authMiddleware, async (req, res) => {
    // Calculate date range for current month
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // MongoDB Aggregation Pipeline
    const incomingTransfers = await Transaction.aggregate([
        {
            $match: {
                receiverId: user._id,
                type: 'transfer',
                timestamp: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }
            }
        },
        {
            $group: {
                _id: null,
                totalBudget: { $sum: '$amount' }
            }
        }
    ]);
    
    // Calculate spending percentage
    const spent = totalBudget - user.balance;
    const percentage = (spent / totalBudget) * 100;
    
    // Color-coded status
    let status = 'green';
    if (percentage > 80) status = 'red';
    else if (percentage > 50) status = 'orange';
});
```

**Key Concepts:**

| Concept | Explanation |
|---------|-------------|
| **MongoDB Aggregation** | Pipeline for data transformation and analysis |
| `$match` | Filters documents (like WHERE in SQL) |
| `$group` | Groups documents and performs calculations (like GROUP BY) |
| `$sum` | Aggregation operator to sum values |
| **Status Logic** | Green (0-50%), Orange (50-80%), Red (80-100%) |

#### 2. Monthly Breakdown Route (`GET /api/analytics/monthly-breakdown`)
```javascript
// Groups income by type (deposit/transfer)
const incomeBreakdown = await Transaction.aggregate([
    { $match: { type: { $in: ['deposit', 'transfer'] } } },
    { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } }
]);
```
**Key Concepts:**
- `$in` operator: Matches any value in the array
- Returns separate totals for deposits and transfers

### Milestone 2 - React Component
```javascript
// Progress bar color based on status
const getProgressClass = () => {
    if (data.status === 'green') return 'progress-green';
    if (data.status === 'orange') return 'progress-orange';
    return 'progress-red';
};
```
**Key Concepts:**
- Conditional CSS classes for visual feedback
- Uses `useEffect` hook to fetch data on component mount

---

## 03. Khaled Magdy (13003972)
### Feature: Wallet Top-Up System

### Files Overview
| Milestone | File | Description |
|-----------|------|-------------|
| M1 | `03_khaled_magdy_wallet_topup.js` | Wallet logic design |
| M2 | `03_khaled_magdy_TopUpModal_milestone2.jsx` | Top-up modal component |
| M2 | `03_khaled_magdy_TransferModal_milestone2.jsx` | Transfer modal component |
| M3 | `03_khaled_magdy_wallet_topup_milestone3.js` | Wallet operations backend |

### Detailed Code Explanation (Milestone 3)

#### 1. Balance Check Route (`GET /api/wallet/balance`)
```javascript
router.get('/balance', authMiddleware, async (req, res) => {
    const user = await User.findById(req.user._id).select('balance');
    res.json({ success: true, balance: user.balance });
});
```
**Key Concepts:**
- `.select('balance')`: Only retrieves the balance field (optimizes query)

#### 2. Deposit Route (`POST /api/wallet/deposit`)
```javascript
router.post('/deposit', authMiddleware, async (req, res) => {
    // Only parents can deposit
    if (req.user.role !== 'parent') {
        return res.status(403).json({ message: 'Only parents can deposit' });
    }
    
    // Update balance
    user.balance += parseFloat(amount);
    await user.save();
    
    // Record transaction
    const transaction = new Transaction({
        type: 'deposit',
        amount: parseFloat(amount),
        receiverId: user._id,
        description: 'Wallet top-up'
    });
    await transaction.save();
});
```

**Key Concepts:**

| Concept | Explanation |
|---------|-------------|
| **Role-based Access** | Checks `req.user.role` to restrict actions |
| `parseFloat()` | Converts string input to number |
| **Transaction Recording** | Every deposit creates a transaction record |
| **HTTP 403** | Forbidden status for unauthorized actions |

#### 3. Transfer Route (`POST /api/wallet/transfer`)
```javascript
router.post('/transfer', authMiddleware, async (req, res) => {
    // Validate parent role
    // Check sufficient balance
    if (parent.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    // Verify parent-child relationship
    if (child.parentId.toString() !== parent._id.toString()) {
        return res.status(403).json({ message: 'You can only transfer to your own children' });
    }
    
    // Perform transfer (atomic operation)
    parent.balance -= parseFloat(amount);
    child.balance += parseFloat(amount);
    
    await parent.save();
    await child.save();
});
```

**Key Concepts:**
- **Parent-child validation**: Ensures security by checking relationships
- **Atomic balance updates**: Deduct from parent, add to child
- **Transaction logging**: Records transfer with sender and receiver IDs

---

## 04. Omar Samer (13001857)
### Feature: Transaction History & Expense Recording

### Files Overview
| Milestone | File | Description |
|-----------|------|-------------|
| M1 | `04_omar_samer_transaction_history.js` | Transaction tracking design |
| M2 | `04_omar_samer_ExpenseModal_milestone2.jsx` | Expense recording modal |
| M2 | `04_omar_samer_TransactionHistory_milestone2.jsx` | Transaction list component |
| M3 | `04_omar_samer_transactions_milestone3.js` | Full CRUD transaction routes |

### Detailed Code Explanation (Milestone 3)

#### 1. Create Expense Route (`POST /api/transactions`)
```javascript
router.post('/', authMiddleware, async (req, res) => {
    // Validate balance
    if (user.balance < parsedAmount) {
        return res.status(400).json({ message: 'Insufficient balance' });
    }
    
    // Create transaction record
    const transaction = await Transaction.create({
        type: 'expense',
        amount: parsedAmount,
        senderId: user._id,
        receiverId: null,
        description: description || 'Expense'
    });
    
    // Update user balance using atomic operation
    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $inc: { balance: -parsedAmount } },
        { new: true }
    );
});
```

**Key Concepts:**

| Concept | Explanation |
|---------|-------------|
| `Transaction.create()` | Mongoose shorthand for new + save |
| `$inc` operator | Atomic increment/decrement operation |
| `{ new: true }` | Returns updated document after modification |
| **Expense Logic** | senderId is set, receiverId is null |

#### 2. Get Transactions Route (`GET /api/transactions`)
```javascript
router.get('/', authMiddleware, async (req, res) => {
    if (req.user.role === 'parent') {
        // Parents see all family transactions
        const parent = await User.findById(req.user._id).populate('children');
        const childrenIds = parent.children.map(child => child._id);
        
        query = {
            $or: [
                { senderId: req.user._id },
                { receiverId: req.user._id },
                { senderId: { $in: childrenIds } },
                { receiverId: { $in: childrenIds } }
            ]
        };
    } else {
        // Children see only their own
        query = {
            $or: [
                { senderId: req.user._id },
                { receiverId: req.user._id }
            ]
        };
    }
    
    const transactions = await Transaction.find(query)
        .populate('senderId', 'username')
        .populate('receiverId', 'username')
        .sort({ timestamp: -1 })
        .limit(100);
});
```

**Key Concepts:**
- **Role-based queries**: Different data access for parents vs. children
- `$or` with `$in`: Complex query combining multiple conditions
- `.sort({ timestamp: -1 })`: Newest transactions first
- `.limit(100)`: Prevents excessive data retrieval

#### 3. CRUD Operations
| Route | Method | Description |
|-------|--------|-------------|
| `/api/transactions` | POST | Create new expense |
| `/api/transactions` | GET | List all transactions |
| `/api/transactions/:id` | GET | Get single transaction |
| `/api/transactions/:id` | PUT | Update description |
| `/api/transactions/:id` | DELETE | Delete transaction |

---

## 05. Omar Mahmoud (13006696)
### Feature: Smart Daily Calculator

### Files Overview
| Milestone | File | Description |
|-----------|------|-------------|
| M1 | `05_omar_mahmoud_smart_calculator.js` | Calculator logic design |
| M2 | `05_omar_mahmoud_DailyCalculator_milestone2.jsx` | Calculator React component |
| M3 | `05_omar_mahmoud_calculator_milestone3.js` | Analytics backend routes |

### Detailed Code Explanation (Milestone 3)

#### 1. Forecast Route (`GET /api/analytics/forecast`)
```javascript
router.get('/forecast', authMiddleware, async (req, res) => {
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    // Calculate days remaining in month
    const daysRemaining = Math.ceil((lastDayOfMonth - today) / (1000 * 60 * 60 * 24));
    
    // Safe daily spending = balance / days remaining
    const safeDailySpend = daysRemaining > 0
        ? (user.balance / daysRemaining).toFixed(2)
        : user.balance.toFixed(2);
});
```

**Key Concepts:**

| Concept | Explanation |
|---------|-------------|
| **Date Calculation** | `new Date(year, month+1, 0)` gives last day of month |
| **Millisecond Conversion** | `1000 * 60 * 60 * 24` = milliseconds in a day |
| `Math.ceil()` | Rounds up to ensure full days |
| `.toFixed(2)` | Formats to 2 decimal places |

#### 2. Spending Analysis Route (`GET /api/analytics/spending-analysis`)
```javascript
router.get('/spending-analysis', authMiddleware, async (req, res) => {
    // Calculate expenses this month
    const expensesAggregate = await Transaction.aggregate([
        {
            $match: {
                senderId: user._id,
                type: 'expense',
                timestamp: { $gte: firstDayOfMonth, $lte: today }
            }
        },
        {
            $group: {
                _id: null,
                totalSpent: { $sum: '$amount' },
                count: { $sum: 1 }
            }
        }
    ]);
    
    // Calculate projections
    const avgDailySpending = totalSpent / daysElapsed;
    const projectedSpending = avgDailySpending * daysRemaining;
    const projectedBalance = user.balance - projectedSpending;
    
    // Risk assessment
    let riskLevel = 'low';
    let advice = 'Your spending is on track!';
    
    if (projectedBalance < 0) {
        riskLevel = 'high';
        advice = 'Warning: You may run out of funds!';
    } else if (projectedBalance < user.balance * 0.2) {
        riskLevel = 'medium';
        advice = 'Consider reducing daily spending.';
    }
});
```

**Key Concepts:**
- **Projection Logic**: Uses past spending patterns to predict future
- **Risk Assessment**: Categorizes spending habits
- Returns actionable advice based on projections

#### 3. Weekly Summary Route (`GET /api/analytics/weekly-summary`)
```javascript
const dailyExpenses = await Transaction.aggregate([
    { $match: { timestamp: { $gte: weekAgo, $lte: today } } },
    {
        $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            dailyTotal: { $sum: '$amount' },
            count: { $sum: 1 }
        }
    },
    { $sort: { _id: 1 } }
]);
```

**Key Concepts:**
- `$dateToString`: Formats date for grouping by day
- Groups expenses by date to show daily breakdown
- Useful for charts and spending patterns

---

## 06. Bahaa Ahmed
### Feature: Child Account Management

### Files Overview
| Milestone | File | Description |
|-----------|------|-------------|
| M1 | `06_bahaa_ahmed_child_accounts.js` | Child account system design |

**Key Implementations:**
- Child account creation by parents
- Parent-child relationship linking via `parentId` field
- Child dashboard functionality for viewing balance/transactions

---

# API Endpoints Summary

## Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Create parent account | No |
| POST | `/login` | Login and get token | No |
| GET | `/profile` | Get user profile | Yes |

## Wallet (`/api/wallet`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/balance` | Check balance | Yes |
| POST | `/deposit` | Add funds (parent only) | Yes |
| POST | `/transfer` | Send to child | Yes |

## Transactions (`/api/transactions`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create expense | Yes |
| GET | `/` | List transactions | Yes |
| GET | `/:id` | Get single transaction | Yes |
| PUT | `/:id` | Update description | Yes |
| DELETE | `/:id` | Delete transaction | Yes |

## Analytics (`/api/analytics`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/budget` | Budget usage stats | Yes |
| GET | `/monthly-breakdown` | Income/expense breakdown | Yes |
| GET | `/forecast` | Daily spending forecast | Yes |
| GET | `/spending-analysis` | Detailed analysis + risk | Yes |
| GET | `/weekly-summary` | 7-day spending summary | Yes |

---

# Git & GitHub Usage

## Repository Information
- **Repository:** [github.com/Bojack55/Masroofy](https://github.com/Bojack55/Masroofy)
- **Branch:** `main`

## Git Commands Used
```bash
# Clone repository
git clone https://github.com/Bojack55/Masroofy.git

# Configure user
git config user.name "username"
git config user.email "email@example.com"

# Stage, commit, push
git add <filename>
git commit -m "descriptive message"
git push origin main

# Pull updates
git pull origin main

# Check status
git status
```

## File Naming Convention
```
XX_name_feature_milestoneX.extension

Examples:
01_moaz_Login_milestone2.jsx
02_eyad_ahmed_budget_milestone3.js
```

---

# Project Structure
```
Masroofy/
├── README.md
├── CONTRIBUTIONS.md
├── EBD_Wallet_API.postman_collection.json
│
├── [Milestone 1 - Root]
│   ├── 01_moaz_abdelaleem_auth.js
│   ├── 02_eyad_ahmed_budget_tracker.js
│   ├── 03_khaled_magdy_wallet_topup.js
│   ├── 04_omar_samer_transaction_history.js
│   ├── 05_omar_mahmoud_smart_calculator.js
│   └── 06_bahaa_ahmed_child_accounts.js
│
├── milestone_2/ (React Components)
│   ├── 01_moaz_Login_milestone2.jsx
│   ├── 01_moaz_Register_milestone2.jsx
│   ├── 02_eyad_ahmed_BudgetTracker_milestone2.jsx
│   ├── 03_khaled_magdy_TopUpModal_milestone2.jsx
│   ├── 03_khaled_magdy_TransferModal_milestone2.jsx
│   ├── 04_omar_samer_ExpenseModal_milestone2.jsx
│   ├── 04_omar_samer_TransactionHistory_milestone2.jsx
│   └── 05_omar_mahmoud_DailyCalculator_milestone2.jsx
│
└── milestone_3/ (Backend Routes)
    ├── 01_moaz_authentication_milestone3.js
    ├── 02_eyad_ahmed_budget_milestone3.js
    ├── 03_khaled_magdy_wallet_topup_milestone3.js
    ├── 04_omar_samer_transactions_milestone3.js
    └── 05_omar_mahmoud_calculator_milestone3.js
```
