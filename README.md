# Margo's Baby Raffle - Frontend

React SPA frontend with GitHub Actions auto-deployment.

## Quick Deploy to GitHub Pages

```bash
# 1. Create GitHub repo, then:
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/margoraffle.git
git push -u origin main

# 2. Configure GitHub:
# Settings → Secrets → New secret
# Name: VITE_API_URL
# Value: http://your-backend-url.elasticbeanstalk.com

# 3. Enable Pages:
# Settings → Pages → Source: GitHub Actions

# 4. Done! Auto-deploys on every push
```

## Local Development

```bash
npm install
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:8080
npm run dev
```

## Update Content

Edit any file in `src/` and push:
```bash
git commit -am "Update homepage"
git push
# Live in 2 minutes!
```

## Environment Variables

**Required GitHub Secret:**
- `VITE_API_URL` - Backend API URL

**Optional (hardcoded):**
- `VITE_VENMO_USERNAME` - @Christopher-lindeman-7

## Build Manually

```bash
npm run build
# Output: dist/
```

## Tech Stack

- React 18
- Vite
- TailwindCSS
- React Router
- Axios
- Lucide Icons
