# 🍃 MongoDB Setup Guide

You have **2 options** for MongoDB. Choose the one that works best for you:

---

## ⭐ Option 1: MongoDB Atlas (Cloud - RECOMMENDED)

**Easiest option - No installation needed!**

### Step 1: Create Free Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google account
3. Choose **FREE tier** (M0 Sandbox)

### Step 2: Create a Cluster

1. After logging in, click **"Build a Database"**
2. Choose **FREE** tier (M0)
3. Select a **Cloud Provider**: AWS
4. Select a **Region**: Choose closest to you
5. **Cluster Name**: Leave as default or name it `WalletCluster`
6. Click **"Create"** (takes 1-3 minutes)

### Step 3: Create Database User

1. Click **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set username: `walletUser`
5. Set password: `walletPass123` (or your own)
6. User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Allow Network Access 

1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Click **"Database"** in left sidebar
2. Click **"Connect"** button on your cluster
3. Select **"Connect your application"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://walletUser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password (`walletPass123`)

### Step 6: Update Your Backend

Edit `backend/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://walletUser:walletPass123@cluster0.xxxxx.mongodb.net/wallet-system?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**✅ Done! Skip to "Testing MongoDB Connection" below**

---

## 🖥️ Option 2: Local MongoDB Installation

**For offline development**

### For Windows:

#### Step 1: Download MongoDB

1. Go to https://www.mongodb.com/try/download/community
2. Select:
   - **Version**: Latest (7.0.x)
   - **Platform**: Windows
   - **Package**: MSI
3. Click **"Download"**

#### Step 2: Install MongoDB

1. Run the downloaded `.msi` file
2. Choose **"Complete"** installation
3. **Install MongoDB as a Service**: ✅ Check this
4. **Service Name**: MongoDB
5. **Data Directory**: Leave as default (`C:\Program Files\MongoDB\Server\7.0\data`)
6. **Log Directory**: Leave as default
7. Click **"Next"** and **"Install"**
8. Click **"Finish"**

#### Step 3: Verify Installation

Open PowerShell and run:
```powershell
mongod --version
```

Should see something like:
```
db version v7.0.x
```

#### Step 4: Start MongoDB Service

**Option A: Automatic (if installed as service)**
MongoDB should already be running! Test with:
```powershell
mongo --version
```

**Option B: Manual Start**
```powershell
# Start MongoDB
net start MongoDB

# Or run directly:
mongod --dbpath "C:\Program Files\MongoDB\Server\7.0\data"
```

#### Step 5: Update Backend Configuration

Your `backend/.env` should already have:
```env
MONGODB_URI=mongodb://localhost:27017/wallet-system
```

**✅ MongoDB is ready!**

---

## 🧪 Testing MongoDB Connection

### Test 1: Start Your Backend

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

If you see **"✅ MongoDB Connected Successfully"** - You're good to go! 🎉

### Test 2: Check Health Endpoint

Open browser: `http://localhost:5000/api/health`

Should see:
```json
{
  "success": true,
  "message": "Wallet API is running",
  "timestamp": "2025-12-07T13:21:42.000Z"
}
```

---

## 🔧 Troubleshooting

### Error: "MongoNetworkError: failed to connect"

**For Atlas (Cloud):**
- ✅ Check internet connection
- ✅ Verify IP is whitelisted in Network Access
- ✅ Check username/password in connection string
- ✅ Make sure `<password>` is replaced with actual password

**For Local:**
- ✅ Check if MongoDB service is running: `net start MongoDB`
- ✅ Try restarting the service: `net stop MongoDB` then `net start MongoDB`

### Error: "Authentication failed"

**For Atlas:**
- ✅ Go to Database Access
- ✅ Verify user exists and password is correct
- ✅ Update connection string in `.env`

### MongoDB Service Won't Start (Local)

Try manual start:
```powershell
# Create data directory if needed
mkdir C:\data\db

# Start MongoDB manually
mongod --dbpath C:\data\db
```

---

## 📊 View Your Database (Optional)

### MongoDB Compass (GUI Tool)

1. Download from: https://www.mongodb.com/try/download/compass
2. Install and open
3. Paste your connection string
4. Click **"Connect"**

You'll be able to see:
- `wallet-system` database
- `users` collection (after creating accounts)
- `transactions` collection (after making transactions)

---

## 🎯 Quick Summary

**Option 1 (Atlas - Cloud):**
1. Create account at MongoDB Atlas
2. Create free cluster
3. Create database user
4. Whitelist IP address
5. Copy connection string
6. Update `backend/.env`

**Option 2 (Local):**
1. Download MongoDB installer
2. Install as Windows service
3. Verify installation
4. Backend `.env` already configured

**Test:**
```bash
cd backend
npm run dev
# Should see "✅ MongoDB Connected Successfully"
```

---

## 🚀 Next Steps After MongoDB is Running

1. **Start Backend:**
   ```bash
   cd "c:\Users\Eyad\Desktop\EBD Proj\backend"
   npm run dev
   ```

2. **Start Frontend (New Terminal):**
   ```bash
   cd "c:\Users\Eyad\Desktop\EBD Proj\frontend"
   npm start
   ```

3. **Test the App:**
   - Open http://localhost:3000
   - Register a parent account
   - Start using the wallet system!

---

**Need help?** Let me know which option you chose and I can help troubleshoot! 🚀
