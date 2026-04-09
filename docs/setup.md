# 🛠️ MERPATI CMS: Setup Guide

Welcome to the **"Zero-Touch"** setup. This guide is designed to get you live in about 60 seconds. If this looks complicated, simply send this link to your IT friend—they'll know exactly what to do.

---

## 📋 Prerequisites
Before you start, make sure you have:
1.  **Google Account**: For logging into your dashboard.
2.  **Vercel Account**: For free hosting.
3.  **Neon Account**: For a free serverless database.

---

## 🚀 One-Click Deployment

1.  **Create a Repository**: Fork this project on GitHub.
2.  **Import to Vercel**: Connect your fork to Vercel.
3.  **Add Environment Variables**: Copy and paste the keys below into Vercel's "Environment Variables" section.

---

## 🔑 Environment Variables

| Key | Description | Where to get it |
| :--- | :--- | :--- |
| `DATABASE_URL` | Your database connection string | [Neon Console](https://console.neon.tech/) |
| `AUTH_SECRET` | A random 32-character string | Run `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Your Google API Client ID | [Google Cloud Console](https://console.cloud.google.com/) |
| `GOOGLE_CLIENT_SECRET` | Your Google API Client Secret | [Google Cloud Console](https://console.cloud.google.com/) |
| `NEXT_PUBLIC_SITE_URL` | Your production URL | e.g., `https://your-site.vercel.app` |
| `BLOB_READ_WRITE_TOKEN` | Token for image uploads | [Vercel Storage Tab](https://vercel.com/dashboard/storage) |
| `ACTIVE_THEME` | Set your design flavor | `default` or `portfolio` |

---

## 🏁 The First Run (Initialization)

1.  **Deploy**: Hit the deploy button on Vercel.
2.  **Visit your URL**: Open your new site.
3.  **Claim Ownership**: Visit `/admin` and log in with your Google account.
4.  **Super User**: The **first person** to log in becomes the permanent "Super User." Use this account to manage your settings and invite other writers.

---

## 🔔 Optional: Telegram Alerts
Want to get notified on your phone when someone publishes a post?
1. Create a Telegram Bot via `@BotFather`.
2. Invite the bot to your channel.
3. Add your `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` to your Settings in the MERPATI Admin Dashboard.

---

### Need Help?
- **Read the Docs**: Check out the `/docs` folder for advanced modular info.
- **Contact Me**: Reach out at [arinadi.nur@gmail.com](mailto:arinadi.nur@gmail.com) 👋

*Build it fabulously. Keep it independent.*
