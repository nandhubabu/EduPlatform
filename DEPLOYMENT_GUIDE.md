# 🚀 EduPlatform Production Deployment Guide
### Target: **Render (Backend API)** + **Vercel (Frontend Client)**

This setup uses the free tiers of both Render and Vercel, providing fast global CDN delivery for the frontend and automated CI/CD directly from your GitHub repository.

---

## 📋 Pre-Flight Checklist

1. Push your latest code to your **GitHub** repository:
   ```bash
   git add .
   git commit -m "Prepare for production deployment"
   git push origin main
   ```
2. Ensure your MongoDB Atlas cluster allows connections from anywhere:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com) -> **Network Access**.
   - Ensure IP address `0.0.0.0/0` is added to the IP Access List (required for cloud hosts like Render).

---

## 🛠️ Step 1: Deploy Backend to Render (Takes ~3 mins)

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository (`EduPlatform`).
3. Fill in the service configuration:
   - **Name**: `eduplatform-backend` (or your chosen name)
   - **Region**: Choose closest to you (e.g., *Singapore*, *Frankfurt*, or *Oregon*)
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`

4. Scroll down to **Environment Variables** and add the following:

   | Key | Recommended Value | Notes |
   |---|---|---|
   | `NODE_ENV` | `production` | Enables secure cross-origin cookies & optimizations |
   | `PORT` | `5000` | Render will also assign its own port automatically |
   | `MONGO_URI` | `mongodb+srv://nandhubabuvizh_db_user:agF5N00PHJ6RwNc1@cluster0.guboadq.mongodb.net/eduplatform?retryWrites=true&w=majority&appName=Cluster0` | Your MongoDB Atlas connection URI |
   | `JWT_SECRET` | `eduplatform_production_jwt_super_secret_key_2026` | Any strong secret string |
   | `FRONTEND_URL` | `https://your-app.vercel.app` | (You can set this after Step 2, or leave as placeholder for now) |

5. Click **Create Web Service**.
6. Render will build and start your server. When deployment succeeds, copy your backend URL at the top:
   > 📌 **Your Backend URL**: `https://eduplatform-backend-xxxx.onrender.com`
7. Verify by opening `https://eduplatform-backend-xxxx.onrender.com/health` in your browser. You should see:
   ```json
   { "status": "OK", "message": "Server is running" }
   ```

---

## ⚡ Step 2: Deploy Frontend to Vercel (Takes ~2 mins)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New...** -> **Project**.
2. Import your GitHub repository (`EduPlatform`).
3. In the project setup window:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click **Edit** and select `client`
   - **Build Command**: `npm run build` (Default)
   - **Output Directory**: `dist` (Default)
   - **Install Command**: `npm install` (Default)

4. Expand the **Environment Variables** section and add:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | `https://eduplatform-backend-xxxx.onrender.com` |

   *(Replace with your actual Render backend URL from Step 1 — do not include a trailing slash!)*

5. Click **Deploy**.
6. In ~60 seconds, Vercel will complete the build and assign your production URL:
   > 📌 **Your Frontend URL**: `https://eduplatform-frontend-xxxx.vercel.app`

---

## 🔄 Step 3: Link Frontend to Backend (Final 30 Seconds)

1. Return to your [Render Dashboard](https://dashboard.render.com/) -> Click on your `eduplatform-backend` service.
2. Go to **Environment** tab on the left.
3. Edit `FRONTEND_URL` and paste your exact Vercel frontend URL:
   ```
   FRONTEND_URL=https://eduplatform-frontend-xxxx.vercel.app
   ```
4. Click **Save Changes** (Render will automatically redeploy with the new origin in 30 seconds).

---

## ✅ Step 4: Verification & Testing

Open your live Vercel URL and test:
1. **Catalog Browsing**: Visit `/courses` — verify that courses load dynamically from MongoDB.
2. **Authentication**: Register a new user and login — confirm that JWT session cookies are stored securely.
3. **Classroom Player**: Open `/courses/:courseId/learn` to verify video streaming and syllabus navigation.
4. **AI Career Explorer**: Open `/assessment` to test career matching.
5. **Instructor Studio**: Login as an instructor and verify `/instructor-courses` and `/instructor-add-course`.
