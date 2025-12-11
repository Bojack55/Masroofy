# 💰 Masroofy - MERN Stack Wallet Management System

A comprehensive parent-child wallet management system built with the MERN stack (MongoDB, Express, React, Node.js). Parents can manage allowances for their children with real-time balance tracking, smart spending analytics, and complete transaction history.

**Masroofy** is a fintech application that links each parent with their children to deposit pocket money and keep track of their spending and balances, promoting financial literacy in a safe digital environment.

## 👥 Team Members

| Name | ID | Feature |
| :--- | :--- | :--- |
| Moaz Abdelaleem | 13007327 | User Authentication & Hierarchy |
| Eyad Ahmed Saeed | 13005578 | Visual Budget Tracker |
| Omar Khaled | 13003972 | Wallet Top-Up | 
| Omar Samer | 13001857 | Transaction History & Audit |
| Omar Mahmoud | 13006696 | Smart Daily Calculator |
| Bahaa Aldin Ahmed | 13002233 | User Authentication & Hierarchy |

## ✨ Features

### 🔐 Authentication & Hierarchy
- **Parent Registration**: Create a parent account with email and password
- **Secure Login**: JWT-based authentication for both parents and children
- **Child Account Creation**: Parents can create multiple child accounts

### 💳 Wallet Management
- **Top-Up Wallet**: Parents can deposit funds (simulated payment gateway)
- **P2P Transfers**: Transfer money from parent to child accounts
- **Real-time Balance Updates**: Instant balance synchronization
- **Transaction Validation**: Insufficient balance protection

### 📊 Smart Analytics (Child Dashboard)
- **Daily Spending Calculator**: Calculate safe daily spending based on days remaining in the month
- **Budget Tracker**: Visual progress bar showing monthly budget usage
  - 🟢 Green: 0-50% used (Great!)
  - 🟡 Orange: 51-80% used (Watch out!)
  - 🔴 Red: 81-100% used (Budget limit!)

### 📜 Transaction History
- **Complete Audit Trail**: View all deposits and transfers
- **Smart Filtering**: Filter by income/expense
- **Role-Based Access**: Parents see their children's transactions too

## 🚀 Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs for password hashing

**Frontend:**
- React 18
- React Router v6
- Axios for API calls
- Modern CSS with custom design system

## 📁 Project Structure

```
EBD Proj/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema (Parent/Child)
│   │   └── Transaction.js   # Transaction schema
│   ├── routes/
│   │   ├── authRoutes.js    # Authentication endpoints
│   │   ├── walletRoutes.js  # Deposit & Transfer
│   │   ├── analyticsRoutes.js # Forecast & Budget
│   │   └── transactionRoutes.js # Transaction history
│   ├── middleware/
│   │   └── authMiddleware.js # JWT verification
│   ├── server.js            # Express server
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── ParentDashboard.jsx
    │   │   ├── ChildDashboard.jsx
    │   │   ├── TopUpModal.jsx
    │   │   ├── TransferModal.jsx
    │   │   ├── AddChildModal.jsx
    │   │   ├── DailyCalculator.jsx
    │   │   ├── BudgetTracker.jsx
    │   │   └── TransactionHistory.jsx
    │   ├── App.js           # Routes & Protected Routes
    │   ├── api.js           # Axios API service
    │   ├── index.css        # Premium design system
    │   └── index.js
    ├── public/
    │   └── index.html
    └── package.json
```

## 🧪 API Testing

A comprehensive **Postman Collection** (`EBD_Wallet_API.postman_collection.json`) is included in the repository, demonstrating that all endpoints are working as expected.

### Postman Collection Features:
- ✅ Complete API endpoint coverage
- ✅ Automated test scripts for each request
- ✅ Environment variables for easy configuration
- ✅ Sequential execution support
- ✅ Error handling demonstrations

**Import the collection** into Postman and run it to verify all endpoints are functioning correctly.

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/Bojack55/Masroofy.git
cd Masroofy
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your MongoDB URI
# MONGODB_URI=mongodb://localhost:27017/wallet-system
# JWT_SECRET=your_secret_key
# PORT=5000

# Start MongoDB (if using local)
# mongod

# Start the backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate to frontend (open new terminal)
cd frontend

# Install dependencies
npm install

# Start the React app
npm start
```

Frontend will run on `http://localhost:3000`

## 🎯 Usage Guide

### For Parents:

1. **Register** at `/register` with email and password
2. **Login** to access your parent dashboard
3. **Top Up** your wallet using the "Top Up Wallet" button
4. **Add Children** by clicking "Add Child" and creating their accounts
5. **Transfer Money** to your children using the "Transfer to Child" button
6. **View History** of all transactions in the transaction table

### For Children:

1. **Login** with the username and password your parent created
2. **View Balance** on your dashboard
3. **Check Daily Spend** to see how much you can safely spend today
4. **Monitor Budget** with the visual progress bar
5. **Review Transactions** to track your allowance history

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register parent account
- `POST /api/auth/login` - Login (parent or child)
- `POST /api/auth/create-child` - Create child account (protected)
- `GET /api/auth/profile` - Get user profile (protected)

### Wallet
- `GET /api/wallet/balance` - Get current balance (protected)
- `POST /api/wallet/deposit` - Deposit funds (parent only)
- `POST /api/wallet/transfer` - Transfer to child (parent only)

### Analytics
- `GET /api/analytics/forecast` - Get daily spending forecast (protected)
- `GET /api/analytics/budget` - Get budget tracker data (protected)

### Transactions
- `GET /api/transactions?type=income|expense` - Get transaction history (protected)

## 🎨 Design Features

- **Premium Color Palette**: Modern gradients and harmonious colors
- **Glassmorphism**: Frosted glass effect on cards
- **Smooth Animations**: Fade-in, slide-in, and hover effects
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark Theme**: Eye-friendly dark mode interface
- **Inter Font**: Modern, professional typography

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Protected routes (frontend & backend)
- Role-based access control
- Input validation and sanitization

## 📝 Database Schema

### User Model
```javascript
{
  username: String,
  email: String (parents only),
  password: String (hashed),
  role: 'parent' | 'child',
  balance: Number,
  parentId: ObjectId (children only),
  children: [ObjectId] (parents only)
}
```

### Transaction Model
```javascript
{
  type: 'deposit' | 'transfer' | 'expense',
  amount: Number,
  senderId: ObjectId,
  receiverId: ObjectId,
  description: String,
  timestamp: Date
}
```

## 🚧 Future Enhancements

- [ ] Spending goals and savings targets
- [ ] Transaction categories and tags
- [ ] Email notifications for transactions
- [ ] Export transaction history to CSV
- [ ] Multi-currency support
- [ ] Recurring allowances (weekly/monthly)
- [ ] Parent approval for child withdrawals

## 📄 License

This project is built for educational purposes.

## 🙏 Acknowledgments

Built following the MERN stack best practices with modern UI/UX design principles.

---

**Made with ❤️ using the MERN Stack**
