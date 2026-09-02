# Deployment Guide: GitHub & Render (1-Click Setup)

This repository is pre-configured to run both the React frontend and Express API backend as a single unified service on **Render**.

---

## 🔒 iPhone / iOS Security Guarantee
- **Zero Safari Warnings / Alerts**: The application requests **zero device permissions** (no camera, mic, location, or push notifications).
- **Safe Privacy Techniques**: The privacy shield uses standard passive DOM events (`visibilitychange`, `blur`) and pure CSS (`user-select: none`, `-webkit-touch-callout: none`) which are 100% compliant with Apple WebKit security guidelines.
- **SSL / HTTPS**: When deployed on Render, your app automatically receives an official, trusted HTTPS certificate from Let's Encrypt with no browser security warnings.

---

## Part 1: Push to GitHub

1. Open your terminal in this project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Sia app for Upasana"
   ```

2. Create a new **Private** or **Public** repository on [GitHub](https://github.com/new).

3. Link and push your code:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

---

## Part 2: Deploy to Render (Web Service)

1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New + > Web Service**.
2. Connect your GitHub repository.
3. Configure the service settings:
   * **Name**: `sia-app` (or any name you like)
   * **Region**: *Singapore* or *Frankfurt* (closest to India / Asia)
   * **Branch**: `main`
   * **Runtime**: `Node`
   * **Build Command**: `npm install && npm run build`
   * **Start Command**: `npm start`
   * **Instance Type**: `Free`

4. Add **Environment Variables** (under *Advanced* or *Environment* tab):
   * `SHEET_WEBHOOK_URL` = `https://script.google.com/macros/s/AKfycby8ips_E_fHzsiKQZvzHIw0hKJ0cuZ3JvtD4GCCcJCF7AX5Imkl542WXEqFZ8wA9z72bg/exec`
   * `GEMINI_API_KEY` = *(Optional: paste your Gemini API key if you want custom AI chat for Sia)*

5. Click **Create Web Service**.
6. Render will build and deploy your app in about 1-2 minutes and give you a live URL like `https://sia-app.onrender.com`.

---

## Part 3: Test on iPhone
Open the Render URL on Upasana's iPhone (in Safari or Chrome). It will load immediately in fullscreen iOS styling with zero security warnings!
