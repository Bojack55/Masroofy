# 📋 Masroofy Quick Reference Guide

## 🚀 Local Development

### Start Backend Server
```bash
cd backend
npm install
npm run dev
```
**URL**: http://localhost:5000

### Start Frontend Server
```bash
cd frontend
npm install
npm start
```
**URL**: http://localhost:3000

---

## 🔑 Login Credentials (Testing)

### Test Parent Account
- **Email/Username**: parent@test.com
- **Password**: test123

### Test Child Account
- **Username**: child1
- **Password**: test123

*Note: Create your own accounts for actual use*

---

## 📌 Key Features by User Type

### 👨‍👩‍👧 Parent Can:
- ✅ Register & Login
- ✅ Top up wallet
- ✅ Add child accounts
- ✅ Transfer money to children
- ✅ View all children's balances
- ✅ View transaction history

### 👧👦 Child Can:
- ✅ Login (with parent-created account)
- ✅ View balance
- ✅ Check daily spending calculator
- ✅ Monitor budget tracker
- ✅ View transaction history

---

## 🛠️ API Endpoints Quick Reference

### Authentication
```
POST /api/auth/register      - Register parent
POST /api/auth/login         - Login
POST /api/auth/create-child  - Create child (parent only)
GET  /api/auth/profile       - Get user profile
```

### Wallet
```
GET  /api/wallet/balance     - Get balance
POST /api/wallet/deposit     - Deposit (parent only)
POST /api/wallet/transfer    - Transfer to child (parent only)
```

### Analytics
```
GET /api/analytics/forecast  - Daily spending calculator
GET /api/analytics/budget    - Budget tracker data
```

### Transactions
```
GET /api/transactions        - Get all transactions
GET /api/transactions?type=income   - Get income only
GET /api/transactions?type=expense  - Get expenses only
```

---

## 🌐 Deployment URLs (After Deployment)

### Production
- **Frontend**: https://masroofy.vercel.app
- **Backend API**: https://masroofy-api.onrender.com
- **Database**: MongoDB Atlas

### Environment Variables

**Backend (.env)**:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=production
CLIENT_URL=https://masroofy.vercel.app
```

**Frontend (.env.production)**:
```env
REACT_APP_API_URL=https://masroofy-api.onrender.com/api
```

---

## 🐛 Common Issues & Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| Cannot login | Check credentials, clear browser cache |
| CORS error | Update CLIENT_URL in backend .env |
| Balance not updating | Refresh page (F5) |
| API not responding | Check if backend server is running |
| MongoDB connection failed | Verify MONGODB_URI in .env |

---

## 📊 Project Structure

```
EBD Proj/
├── backend/               # Express.js API
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # JWT auth
│   └── server.js         # Main server file
│
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.js       # Routes
│   │   └── api.js       # Axios instance
│   └── public/
│
├── DEPLOYMENT_GUIDE.md   # Full deployment instructions
├── USER_GUIDE.md         # Complete user manual
└── README.md             # Project overview
```

---

## 🎯 Testing Checklist

- [ ] Backend server starts on port 5000
- [ ] Frontend server starts on port 3000
- [ ] MongoDB connection successful
- [ ] Can register parent account
- [ ] Can login as parent
- [ ] Can top up wallet
- [ ] Can create child account
- [ ] Can transfer money to child
- [ ] Can login as child
- [ ] Child sees correct balance
- [ ] Daily calculator shows data
- [ ] Budget tracker displays
- [ ] Transaction history loads

---

## 📞 Support Resources

- **Full User Guide**: `USER_GUIDE.md`
- **Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **Project README**: `README.md`
- **API Tests**: `EBD_Wallet_API.postman_collection.json`

---

## 🎓 Team Members & Features

| Name | ID | Feature |
|------|----|---------  |
| Moaz Abdelaleem | 13007327 | User Authentication & Hierarchy |
| Eyad Ahmed | 13005578 | Visual Budget Tracker |
| Omar Khaled | 13003972 | Wallet Top-Up |
| Omar Samer | 13001857 | Transaction History & Audit |
| Omar Mahmoud | 13006696 | Smart Daily Calculator |
| Bahaa Aldin Ahmed | 13002233 | Child Accounts Management |

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Stack**: MERN (MongoDB, Express, React, Node.js)
