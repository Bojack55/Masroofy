# 🔧 Environment Configuration

## Your MongoDB Atlas Connection String

Based on your MongoDB Atlas setup, you need to update `backend/.env` file.

### Step 1: Get Your Connection String from MongoDB Atlas

1. Go to your MongoDB Atlas dashboard
2. Click **"Connect"** on your cluster
3. Select **"Connect your application"**
4. Copy the connection string

It will look like:
```
mongodb+srv://walletUser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 2: Replace the Placeholders

1. Replace `<password>` with: `walletPass123` (or your actual password)
2. Add `/wallet-system` before the `?` to specify the database name

**Final connection string should look like:**
```
mongodb+srv://walletUser:walletPass123@cluster0.xxxxx.mongodb.net/wallet-system?retryWrites=true&w=majority
```

### Step 3: Update backend/.env

Open `backend/.env` file and make sure it looks like this:

```env
PORT=5000
MONGODB_URI=mongodb+srv://walletUser:walletPass123@cluster0.XXXXX.mongodb.net/wallet-system?retryWrites=true&w=majority
JWT_SECRET=ebd_wallet_secret_key_2024_super_secure
NODE_ENV=development
```

**IMPORTANT:** Replace the `XXXXX` in the connection string with your actual cluster ID from Atlas!

---

## 🚀 Now Let's Start the Application!

### Terminal 1: Start Backend

```bash
cd "c:\Users\Eyad\Desktop\EBD Proj\backend"
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm run dev
```

**Look for this output:**
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
📍 API available at http://localhost:5000/api
```

If you see ✅, your MongoDB connection is working! 🎉

### Terminal 2: Start Frontend

Open a **NEW terminal** window and run:

```bash
cd "c:\Users\Eyad\Desktop\EBD Proj\frontend"
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm start
```

**Your browser will automatically open to:**
```
http://localhost:3000
```

---

## ✅ You're Ready!

1. **Register** a parent account
2. **Top up** your wallet
3. **Create** a child account
4. **Transfer** money
5. **Enjoy** the full wallet system!

---

## 🌐 Want to Deploy to the Internet? (Production Deployment)

I can help you deploy this to the internet so others can access it!

**Free hosting options:**
- **Frontend:** Vercel or Netlify (Free)
- **Backend:** Render or Railway (Free tier)
- **Database:** Already on MongoDB Atlas ✅

Would you like me to create deployment guides for production? Let me know!
