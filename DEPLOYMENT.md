# Rainbow Digi School - Deployment Guide

This project is divided into a Frontend (Vite + React) and a Backend (Node.js + Express).

## 1. Environment Variables

Create a `.env` file in the `server` folder based on `.env.example`:

```env
PORT=3001
NODE_ENV=production
# Add external DB connection string or API keys for Whatsapp/Email if implemented later
```

Create a `.env` file in the root directory (Frontend) if needed, for instance, to store the backend URL:

```env
VITE_API_URL=https://api.rainbowdigischool.com
```
(Be sure to update `fetch` calls in the frontend to use `import.meta.env.VITE_API_URL || 'http://localhost:3001'` instead of hardcoded localhost).

## 2. Frontend Deployment (Vercel or Netlify)

The frontend is a standard Vite single-page application.

### Deploying to Vercel
1. Push your repository to GitHub.
2. Go to Vercel dashboard and click "Add New Project".
3. Select your repository.
4. Vercel will automatically detect the Vite framework.
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **Deploy**.

### Deploying to Netlify
1. Go to Netlify dashboard and click "Add new site" -> "Import an existing project".
2. Select GitHub and authorize.
3. Pick your repository.
4. Build settings:
   - Build Command: `npm run build`
   - Publish directory: `dist`
5. Click **Deploy site**.

> **Note on Routing:** Since we use React Router (`BrowserRouter`), Netlify requires a `_redirects` file in the `public` folder with the following content:
> `/* /index.html 200`
> Vercel handles this automatically for Vite.

## 3. Backend Deployment (Render or Railway)

The backend is a Node.js Express server.

### Deploying to Render
1. In Render dashboard, click "New" -> "Web Service".
2. Connect your GitHub repository.
3. Set the following:
   - Root Directory: `server`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start` (ensure `"start": "node server.js"` is in `server/package.json`).
4. Set your Environment Variables (`PORT`, etc.).
5. **Database:** SQLite stores data in a local file. On Render's free tier, the disk is ephemeral, meaning data will be lost on restart. For production, either attach a Render Persistent Disk to the `/server` path where `school.db` lives, or migrate to a managed database (like MongoDB or PostgreSQL).
6. Click **Create Web Service**.

### Deploying to Railway
1. Click "New Project" -> "Deploy from GitHub repo".
2. Select the repository.
3. Add a persistent volume for the SQLite database so data persists across redeploys.
4. Add environment variables.
5. Deploy!

## 4. CI/CD (GitHub Actions)

A basic GitHub Action to lint and build the frontend:

```yaml
name: Node.js CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18.x'
    - run: npm ci
    - run: npm run build
```
