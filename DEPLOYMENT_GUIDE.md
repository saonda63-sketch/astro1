# GitHub Deployment Step-by-Step Guide for AstroPredict

Complete guide to deploy AstroPredict on GitHub with full CI/CD pipeline and multiple hosting options.

## Table of Contents
1. [Initial GitHub Setup](#initial-github-setup)
2. [Local Repository Setup](#local-repository-setup)
3. [Deployment Options](#deployment-options)
4. [Setting Up CI/CD](#setting-up-cicd)
5. [Production Deployment](#production-deployment)
6. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Initial GitHub Setup

### Step 1: Create Repository on GitHub

1. Go to [github.com](https://github.com)
2. Sign in to your account
3. Click **+** icon → **New repository**
4. Fill in details:
   - Repository name: `astro1`
   - Description: "Full-fledged Astrology Website with Life Predictions"
   - Visibility: Public
   - Initialize with: Add .gitignore (Python)
5. Click **Create repository**

### Step 2: Get Repository URL

- Click **Code** button (green)
- Copy the URL (HTTPS or SSH)
- You'll need this for local setup

---

## Local Repository Setup

### Step 1: Initialize Git Locally

```bash
cd /workspaces/astro1

# Initialize git
git init

# Add GitHub as remote
git remote add origin https://github.com/saonda63-sketch/astro1.git

# Verify remote
git remote -v
```

### Step 2: Configure Git

```bash
# Set your GitHub user info
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Add All Files

```bash
# Check what will be added
git status

# Add all files
git add .

# Verify files are staged
git status
```

### Step 4: Make Initial Commit

```bash
git commit -m "Initial commit: Full-fledged astrology website with predictions"
```

### Step 5: Push to GitHub

```bash
# Push to main branch
git branch -M main
git push -u origin main
```

✅ Your code is now on GitHub!

---

## Deployment Options

### Option 1: Frontend on GitHub Pages + Backend on Heroku (Recommended)

This is the best option for a free tier deployment.

#### Frontend Setup (GitHub Pages)

**Step 1: Enable GitHub Pages**

1. Go to Repository Settings
2. Scroll to **Pages** section
3. Select **Deploy from a branch**
4. Branch: `main`
5. Folder: `/frontend`
6. Click **Save**

Your frontend will be available at: `https://saonda63-sketch.github.io/astro1/`

**Step 2: Update API URL**

In `frontend/script.js`, update the API URL:

```javascript
const API_BASE_URL = 'https://your-heroku-backend.herokuapp.com/api';
```

#### Backend Setup (Heroku)

**Step 1: Create Heroku Account**

1. Go to [heroku.com](https://heroku.com)
2. Sign up (free tier available)
3. Verify email

**Step 2: Install Heroku CLI**

```bash
# On Windows: Download from heroku.com
# On macOS:
brew tap heroku/brew && brew install heroku

# On Linux:
curl https://cli-assets.heroku.com/install.sh | sh
```

**Step 3: Login to Heroku**

```bash
heroku login
```

**Step 4: Create Heroku App**

```bash
cd backend

# Create app
heroku create astropredict-app

# Or with custom name
heroku create your-app-name
```

**Step 5: Add Production Dependencies**

Update `backend/requirements.txt` with Gunicorn:

```
Flask==3.0.0
Flask-CORS==4.0.0
python-dotenv==1.0.0
ephem==4.1.5
pytz==2023.3
requests==2.31.0
gunicorn==21.2.0
```

**Step 6: Create Procfile**

In project root, create `Procfile`:

```
web: cd backend && gunicorn -b 0.0.0.0:$PORT -w 4 app:app
```

**Step 7: Deploy to Heroku**

```bash
# Push to Heroku
git push heroku main

# View logs
heroku logs --tail
```

**Step 8: Set Environment Variables**

```bash
heroku config:set DEBUG=False
heroku config:set FLASK_ENV=production
```

✅ Backend is now live on Heroku!

---

### Option 2: Full Stack on Railway (Easiest)

Railway is a modern platform that makes deployment super easy.

**Step 1: Connect GitHub**

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Connect your GitHub account
6. Select `astro1` repository

**Step 2: Configure Services**

Railway will auto-detect your services:

- Backend (Python): Port 5000
- Frontend (Static): Port 80

**Step 3: Set Environment Variables**

Click each service → Variables:

Backend:
```
DEBUG=False
FLASK_ENV=production
```

Frontend:
```
API_URL=https://your-railway-backend-url/api
```

**Step 4: Deploy**

Click "Deploy" button. Railway handles everything!

✅ Full stack is deployed!

---

### Option 3: Full Stack on Vercel + Railway

Vercel for frontend, Railway for backend.

**Frontend on Vercel:**

1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Select your GitHub repo
4. Root Directory: `frontend`
5. Click Import
6. Set `API_URL` environment variable

**Backend on Railway:** (Follow Option 2)

---

### Option 4: Docker Deployment on AWS/Google Cloud

**Prerequisites:**
- AWS or Google Cloud account
- Docker installed

**Step 1: Build Docker Images**

```bash
# Build backend
docker build -f docker/Dockerfile.backend -t astro-backend .

# Build frontend
docker build -f docker/Dockerfile.frontend -t astro-frontend .
```

**Step 2: Push to Container Registry**

```bash
# AWS ECR
aws ecr get-login-password | docker login --username AWS --password-stdin YOUR_REGISTRY
docker tag astro-backend YOUR_REGISTRY/astro-backend
docker push YOUR_REGISTRY/astro-backend

# Or Google Cloud
gcloud auth configure-docker
docker tag astro-backend gcr.io/PROJECT_ID/astro-backend
docker push gcr.io/PROJECT_ID/astro-backend
```

**Step 3: Deploy**

Use Cloud Run, App Engine, or Kubernetes to deploy containers.

---

## Setting Up CI/CD

### GitHub Actions Setup

We've already added workflow files. Here's how they work:

**Step 1: Add Secrets**

1. Go to Repository Settings
2. Select "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add these secrets:

For Heroku deployment:
```
HEROKU_API_KEY=<your-heroku-api-key>
HEROKU_APP_NAME=<your-app-name>
HEROKU_EMAIL=<your-email>
```

To get Heroku API Key:
```bash
heroku authorizations:create
```

**Step 2: Workflows Run Automatically**

On every push:
- ✅ Tests run
- ✅ Code is linted
- ✅ Docker images build
- ✅ Deploy to production (if main branch)

Check **Actions** tab to see status.

---

## Production Deployment

### Checklist Before Going Live

- [ ] Frontend deployed and accessible
- [ ] Backend API running
- [ ] CORS properly configured
- [ ] Environment variables set
- [ ] SSL/HTTPS enabled
- [ ] Error monitoring setup
- [ ] Database backups configured
- [ ] Rate limiting enabled
- [ ] Secrets not in code

### Set Up Custom Domain

**For Frontend (GitHub Pages):**

1. Register domain on GoDaddy, Namecheap, etc.
2. Go to Repository Settings → Pages
3. Enter custom domain
4. Add DNS records (CNAME/A records)

**For Backend (Heroku):**

1. Buy domain
2. Run: `heroku domains:add your-domain.com`
3. Update DNS records
4. Verify: `heroku domains`

### Enable HTTPS/SSL

- GitHub Pages: Automatic ✅
- Heroku: Automatic ✅
- Railway: Automatic ✅
- Custom domain: Use Let's Encrypt (free)

```bash
# Let's Encrypt (if using own server)
sudo certbot certonly --nginx -d yourdomain.com
```

---

## Monitoring & Maintenance

### View Live Logs

**Heroku:**
```bash
heroku logs --tail
heroku logs --tail --app your-app-name
```

**GitHub Actions:**
- Go to Actions tab
- Click workflow
- See real-time logs

### Monitor Performance

1. **Uptime Monitoring**
   - Use UptimeRobot (free)
   - Add your URLs
   - Get alerts if down

2. **Error Tracking**
   - Add Sentry.io
   - Get notified of errors

3. **Analytics**
   - Add Google Analytics
   - Track user behavior

### Regular Maintenance

**Weekly:**
- Check logs for errors
- Monitor response times

**Monthly:**
- Update dependencies
- Review error reports
- Check security advisories

**Quarterly:**
- Performance audit
- Security audit
- Feature review

### Update Deployment

```bash
# Make changes locally
git add .
git commit -m "Update: Description of changes"
git push origin main

# GitHub Actions automatically:
# 1. Runs tests
# 2. Builds Docker images
# 3. Deploys to production

# Check status in Actions tab
```

---

## Troubleshooting

### Backend not responding

```bash
# Check Heroku logs
heroku logs --tail

# Restart dyno
heroku dyno:restart web
```

### CORS errors

Update `backend/app.py`:
```python
CORS(app, resources={r"/api/*": {
    "origins": ["https://your-frontend-url"]
}})
```

### API URL issues

Update `frontend/script.js`:
```javascript
const API_BASE_URL = 'https://your-backend-url/api';
```

### Push fails

```bash
# Pull latest
git pull origin main

# Force push (careful!)
git push origin main --force
```

---

## Success! 🎉

Your astrology website is now live! 

### What's Available:

✅ **Frontend**: https://saonda63-sketch.github.io/astro1/
✅ **Backend API**: https://your-heroku-app.herokuapp.com/api
✅ **GitHub Repo**: https://github.com/saonda63-sketch/astro1
✅ **CI/CD Pipeline**: Automatic testing and deployment

### Next Steps:

1. Share your link with friends
2. Monitor usage and feedback
3. Iterate and improve
4. Scale as needed

### Marketing Tips:

- Post on social media
- Create demo video
- Write blog about astrology
- SEO optimize
- Ask users for feedback
- Add more features

---

## Quick Reference Commands

```bash
# Git commands
git status              # Check status
git add .              # Add all files
git commit -m "msg"    # Commit
git push               # Push to GitHub
git pull               # Pull from GitHub

# Heroku commands
heroku create app-name # Create app
git push heroku main   # Deploy
heroku logs --tail     # View logs
heroku config:set KEY=VALUE  # Set env vars

# Local testing
cd backend && python app.py      # Run backend
cd frontend && python -m http.server 8000  # Run frontend
```

---

## Support & Resources

- GitHub Issues: Report bugs
- GitHub Discussions: Ask questions
- Heroku Docs: heroku.com/docs
- Railway Docs: docs.railway.app
- Flask Docs: flask.palletsprojects.com

---

**Deployment Date**: November 2024  
**Status**: Production Ready ✅

Happy deploying! 🚀✨
