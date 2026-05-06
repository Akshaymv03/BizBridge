# BizBridge Deployment Guide

This repository is fully configured for a **100% free deployment** using **Vercel** (for the frontend) and **Render** (for the backend and database).

## 1. Push your code to GitHub
If you haven't already, commit your changes and push this folder to a GitHub repository.

```bash
git add .
git commit -m "Configure for deployment"
git push origin main
```

## 2. Deploy Backend & Database (Render.com - Free)

1. Create a free account at [Render.com](https://render.com).
2. Go to your Dashboard and click **New +** -> **Blueprints**.
3. Connect your GitHub account and select your `bizbridge` repository.
4. Render will automatically read the `render.yaml` file in your repository.
5. It will automatically provision two things for free:
   - A PostgreSQL Database (`bizbridge-db`)
   - Your Django API Web Service (`bizbridge-api`)
6. Click **Apply**. Render will start building your backend.
7. Once deployed, Render will give you a free domain (e.g., `https://bizbridge-api-xyz.onrender.com`).
   *Note: On the free tier, the backend will "sleep" after 15 minutes of inactivity and take ~50 seconds to wake up on the next request.*

## 3. Deploy Frontend (Vercel.com - Free)

1. Create a free account at [Vercel.com](https://vercel.com).
2. Click **Add New...** -> **Project**.
3. Import your `bizbridge` GitHub repository.
4. Vercel will ask you to configure the project.
   - **Framework Preset**: React / Vite (Vercel usually detects this automatically).
   - **Root Directory**: Click `Edit` and select `frontend`.
5. **Environment Variables**:
   - You need to tell your React app where the backend is. Add a variable:
   - Name: `VITE_API_URL`
   - Value: `https://bizbridge-api-xyz.onrender.com` *(Replace this with the actual URL Render gave you in Step 2)*.
6. Click **Deploy**. Vercel will build and host your frontend on a free `.vercel.app` domain.

## 4. Run Migrations & Create Superuser
Once the Render backend is live, you need to set up the database tables:
1. Go to your `bizbridge-api` web service on the Render dashboard.
2. Click on the **Shell** tab on the left.
3. Run the following commands in the web terminal:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```
4. Follow the prompts to create your admin user.

🎉 **You're done! Your full-stack app is live.**
