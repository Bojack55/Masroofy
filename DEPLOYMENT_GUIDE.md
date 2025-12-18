# 🚀 Masroofy Deployment Guide

This guide will walk you through deploying the Masroofy Wallet Management System to production.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment (Render)](#backend-deployment)
3. [Database Setup (MongoDB Atlas)](#database-setup)
4. [Frontend Deployment (Vercel)](#frontend-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Post-Deployment Testing](#post-deployment-testing)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before deploying, ensure you have:
- ✅ GitHub account with repository access
- ✅ MongoDB Atlas account (free tier works)
- ✅ Vercel account (for frontend)
- ✅ Render account (for backend) OR Heroku/Railway
- ✅ All code pushed to GitHub

---

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Cluster

1. **Sign up/Login** to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

2. **Create a New Project**
   - Click "New Project"
   - Name it "Masroofy" or similar
   - Click "Create Project"

3. **Create a Database Cluster**
   - Click "Build a Database"
   - Select **FREE tier** (M0 Sandbox)
   - Choose a cloud provider (AWS recommended)
   - Select a region close to your users
   - Cluster name: `masroofy-cluster`
   - Click "Create"

4. **Configure Database Access**
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Authentication Method: Password
   - Username: `masroofy-admin`
   - Password: Generate a secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

5. **Configure Network Access**
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - ⚠️ In production, restrict to your server's IP
   - Click "Confirm"

6. **Get Connection String**
   - Go to "Database" → Click "Connect"
   - Choose "Connect your application"
   - Driver: Node.js, Version: 5.5 or later
   - Copy the connection string:
     ```
     mongodb+srv://masroofy-admin:<password>@masroofy-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password
   - Add database name: `masroofy` after `.net/`
     ```
     mongodb+srv://masroofy-admin:YOUR_PASSWORD@masroofy-cluster.xxxxx.mongodb.net/masroofy?retryWrites=true&w=majority
     ```
   - **Save this connection string** for later

---

## 🔧 Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment

1. **Update `backend/package.json`** to include start script:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

2. **Create `backend/.env.production`** (don't commit this):
```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
PORT=5000
NODE_ENV=production
```

3. **Ensure CORS is configured** in `server.js`:
```javascript
const cors = require('cors');
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
```

### Step 2: Deploy on Render

1. **Sign up/Login** to [Render](https://render.com)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `Masroofy` repository

3. **Configure Service**
   - **Name**: `masroofy-api`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

4. **Add Environment Variables**
   - Click "Advanced" → "Add Environment Variable"
   - Add the following:
     ```
     MONGODB_URI = your_mongodb_atlas_connection_string
     JWT_SECRET = your_super_secret_jwt_key
     PORT = 5000
     NODE_ENV = production
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Your API will be live at: `https://masroofy-api.onrender.com`

6. **Test API**
   - Visit: `https://masroofy-api.onrender.com/api/auth/test`
   - Should see a response (you may need to create a test route)

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Deployment

1. **Update `frontend/src/api.js`** to use production API:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

2. **Create `frontend/.env.production`**:
```env
REACT_APP_API_URL=https://masroofy-api.onrender.com/api
```

3. **Test production build locally**:
```bash
cd frontend
npm run build
npx serve -s build
```

### Step 2: Deploy on Vercel

1. **Sign up/Login** to [Vercel](https://vercel.com)

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Project**
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

4. **Add Environment Variables**
   - Click "Environment Variables"
   - Add:
     ```
     REACT_APP_API_URL = https://masroofy-api.onrender.com/api
     ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-5 minutes)
   - Your app will be live at: `https://masroofy.vercel.app`

6. **Update Backend CORS**
   - Go back to Render
   - Add environment variable:
     ```
     CLIENT_URL = https://masroofy.vercel.app
     ```
   - Redeploy backend

---

## ⚙️ Environment Configuration Summary

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/masroofy
JWT_SECRET=super_secret_key_change_in_production
PORT=5000
NODE_ENV=production
CLIENT_URL=https://masroofy.vercel.app
```

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://masroofy-api.onrender.com/api
```

---

## ✅ Post-Deployment Testing

1. **Test Frontend Access**
   - Visit your Vercel URL
   - Should see login page

2. **Test API Connection**
   - Open browser console
   - Try to register a new account
   - Check for CORS errors

3. **Test Complete Flow**
   - Register a parent account
   - Login
   - Top up wallet
   - Create a child account
   - Transfer money
   - View transaction history

4. **Test Child Login**
   - Logout
   - Login as child
   - Verify dashboard shows correct data

---

## 🔧 Troubleshooting

### Issue: CORS Error
**Solution**: Ensure backend `CLIENT_URL` matches frontend deployment URL exactly (no trailing slash)

### Issue: API Not Responding
**Solution**: 
- Check Render logs
- Verify MongoDB connection string
- Ensure all environment variables are set

### Issue: Database Connection Failed
**Solution**:
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check username/password in connection string
- Ensure database user has read/write permissions

### Issue: Frontend Shows "Network Error"
**Solution**:
- Verify `REACT_APP_API_URL` is correct
- Check browser console for specific errors
- Ensure backend is running

### Issue: Authentication Not Working
**Solution**:
- Verify JWT_SECRET is set in backend
- Check if cookies are being set (check browser DevTools)
- Ensure backend and frontend are on HTTPS (or both HTTP locally)

---

## 🌐 Alternative Deployment Options

### Backend Alternatives:
- **Heroku**: Similar to Render, free tier available
- **Railway**: Modern alternative, generous free tier
- **DigitalOcean App Platform**: $5/month, good performance
- **AWS Elastic Beanstalk**: More complex, highly scalable

### Frontend Alternatives:
- **Netlify**: Similar to Vercel, easy deployment
- **GitHub Pages**: Free, but limited to static sites
- **Firebase Hosting**: Google's hosting solution
- **Cloudflare Pages**: Fast global CDN

### Database Alternatives:
- **MongoDB Atlas** (recommended): Free tier, easy setup
- **Self-hosted MongoDB**: Requires VPS
- **MongoDB on Railway**: Integrated solution

---

## 📊 Monitoring & Maintenance

### Recommended Tools:
- **Render Dashboard**: Monitor backend logs and performance
- **Vercel Analytics**: Track frontend usage
- **MongoDB Atlas Monitoring**: Database performance metrics

### Regular Maintenance:
- ✅ Monitor error logs weekly
- ✅ Update dependencies monthly
- ✅ Backup database regularly
- ✅ Check security alerts
- ✅ Review usage metrics

---

## 🔒 Security Checklist

- [ ] Changed default JWT_SECRET
- [ ] MongoDB user has strong password
- [ ] CORS configured to only allow your frontend
- [ ] Environment variables not committed to Git
- [ ] HTTPS enabled on both frontend and backend
- [ ] MongoDB network access restricted (if possible)
- [ ] Regular dependency updates for security patches

---

## 📞 Support & Resources

- **Render Documentation**: https://render.com/docs
- **Vercel Documentation**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com
- **MERN Stack Guide**: https://www.mongodb.com/mern-stack

---

**🎉 Congratulations!** Your Masroofy application is now deployed and accessible worldwide!

**Production URLs**:
- Frontend: `https://masroofy.vercel.app`
- Backend API: `https://masroofy-api.onrender.com`
