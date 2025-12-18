# 🔧 FIXING THE MONGODB CONNECTION ERROR

## ❌ The Problem

Your backend is trying to connect to:
```
mongodb://localhost:27017/wallet-system
```

But you're using **MongoDB Atlas** (cloud), not local MongoDB!

---

## ✅ The Solution

You need to update `backend/.env` with your **MongoDB Atlas connection string**.

### Step 1: Get Your Atlas Connection String

1. Go to https://cloud.mongodb.com/
2. Login to your MongoDB Atlas account
3. Click **"Database"** in the left sidebar
4. Click **"Connect"** button on your cluster
5. Select **"Connect your application"**
6. **Driver:** Node.js
7. **Version:** Latest
8. **Copy** the connection string

It looks like this:
```
mongodb+srv://walletUser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 2: Modify the Connection String

1. Replace `<password>` with your actual password (the one you created in Atlas)
2. Add `/wallet-system` before the `?` to specify the database name

**Example:**
```
mongodb+srv://walletUser:walletPass123@cluster0.ab1cd.mongodb.net/wallet-system?retryWrites=true&w=majority
```

### Step 3: Update backend/.env File

1. **Open:** `c:\Users\Eyad\Desktop\EBD Proj\backend\.env`
2. **Find the line:** `MONGODB_URI=...`
3. **Replace it with your Atlas connection string**

**Your .env file should look like this:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://walletUser:YOUR_PASSWORD@cluster0.XXXXX.mongodb.net/wallet-system?retryWrites=true&w=majority
JWT_SECRET=ebd_wallet_secret_key_2024_super_secure
NODE_ENV=development
```

**IMPORTANT:**
- Replace `YOUR_PASSWORD` with the password you created for the database user
- Replace `cluster0.XXXXX` with your actual cluster ID from Atlas

### Step 4: Restart the Backend

1. **Stop the backend:** In the terminal running the backend, press `Ctrl+C`
2. **Start it again:**
   ```bash
   npm run dev
   ```

**Look for:**
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

---

## 📋 Quick Checklist

Before updating .env, make sure you have:

- ✅ Created a MongoDB Atlas account
- ✅ Created a free cluster
- ✅ Created a database user (username + password)
- ✅ Whitelisted your IP address (or used 0.0.0.0/0 for all IPs)
- ✅ Got your connection string from Atlas

---

## 🆘 Alternative: Use Local MongoDB

If you prefer to use local MongoDB instead of Atlas:

### Option A: Install MongoDB Locally

1. Download from: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. Start MongoDB service:
   ```bash
   net start MongoDB
   ```
4. Keep the .env as is:
   ```env
   MONGODB_URI=mongodb://localhost:27017/wallet-system
   ```

### Option B: Stick with Atlas (Recommended)

MongoDB Atlas is easier and free - just update the connection string!

---

## 🔍 How to Find Your Atlas Cluster ID

Your connection string from Atlas looks like:
```
mongodb+srv://walletUser:password@cluster0.ab1cd.mongodb.net/...
```

The part `cluster0.ab1cd` is your cluster ID. It's unique to your cluster.

---

## 📝 Example .env File (Atlas)

```env
PORT=5000
MONGODB_URI=mongodb+srv://walletUser:mySecurePass123@cluster0.mongodb.net/wallet-system?retryWrites=true&w=majority
JWT_SECRET=ebd_wallet_secret_key_2024_super_secure
NODE_ENV=development
```

---

## ⚡ Quick Fix Steps

1. **Get connection string from MongoDB Atlas**
2. **Edit** `backend/.env`
3. **Replace** the MONGODB_URI line
4. **Save** the file
5. **Restart** backend server
6. **Try registration again**

---

**Need help getting your connection string? Let me know!**
