# Deployment Guide for AstroPredict

This guide covers deploying AstroPredict to various platforms.

## Table of Contents
1. [Local Development](#local-development)
2. [GitHub Deployment](#github-deployment)
3. [Docker Deployment](#docker-deployment)
4. [Cloud Platforms](#cloud-platforms)
5. [Setting up CI/CD](#cicd-setup)
6. [Troubleshooting](#troubleshooting)

## Local Development

### Prerequisites
- Python 3.8+
- Node.js (optional, for frontend)
- Git

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/saonda63-sketch/astro1.git
cd astro1
```

2. **Setup Backend**
```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

3. **Setup Frontend**
```bash
cd ../frontend
python -m http.server 8000
# Or use: npx http-server
```

4. **Access the application**
- Open browser to `http://localhost:8000`
- Backend API at `http://localhost:5000`

## GitHub Deployment

### Step 1: GitHub Pages (Frontend)

1. Go to your repository settings
2. Navigate to "Pages" section
3. Under "Build and deployment":
   - Source: Select "Deploy from a branch"
   - Branch: Select "main" and "/root" folder
4. Click Save

Your frontend will be deployed to: `https://github.com/saonda63-sketch/astro1`

### Step 2: Backend Deployment (Heroku)

See Cloud Platforms section below.

### Step 3: Enable GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r backend/requirements.txt
    
    - name: Lint with flake8
      run: |
        pip install flake8
        flake8 backend/ --count --select=E9,F63,F7,F82 --show-source --statistics
    
    - name: Deploy
      run: |
        # Add your deployment commands here
        echo "Deploying to production..."
```

## Docker Deployment

### Create Docker Files

#### Dockerfile for Backend
Create `docker/Dockerfile.backend`:

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

EXPOSE 5000

ENV FLASK_APP=app.py
ENV FLASK_ENV=production

CMD ["python", "app.py"]
```

#### Dockerfile for Frontend
Create `docker/Dockerfile.frontend`:

```dockerfile
FROM nginx:alpine

COPY frontend/ /usr/share/nginx/html/
COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: docker/Dockerfile.backend
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - DEBUG=False
    restart: always

  frontend:
    build:
      context: .
      dockerfile: docker/Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always
```

### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Cloud Platforms

### Heroku (Recommended for Backend)

1. **Create Heroku account** at heroku.com

2. **Install Heroku CLI**
```bash
npm install -g heroku
```

3. **Create Procfile** in project root:
```
web: cd backend && python app.py
```

4. **Create runtime.txt** in project root:
```
python-3.9.16
```

5. **Deploy**
```bash
heroku login
heroku create astropredict
git push heroku main
```

6. **Set environment variables**
```bash
heroku config:set DEBUG=False
heroku logs --tail
```

### Railway (Full Stack)

1. Visit [railway.app](https://railway.app)
2. Click "New Project"
3. Connect your GitHub repository
4. Configure:
   - Backend service on port 5000
   - Frontend on port 3000
5. Deploy automatically on push

### Vercel (Frontend Only)

1. Visit [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - Framework: Other (HTML/CSS/JS)
   - Root directory: ./frontend
4. Deploy

### AWS (Full Stack)

**Using AWS Elastic Beanstalk:**

1. Install AWS CLI
2. Create `requirements.txt` in root
3. Initialize EB:
```bash
eb init -p python-3.9 astropredict
eb create astropredict-env
eb deploy
```

### Google Cloud Run

```bash
# Install Google Cloud CLI
gcloud init

# Deploy backend
gcloud run deploy astropredict-backend \
  --source backend/ \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# Deploy frontend to Cloud Storage
gsutil -m cp -r frontend/* gs://astropredict-frontend/
```

### DigitalOcean App Platform

1. Connect your GitHub repository
2. Choose Python for backend (Gunicorn)
3. Choose static site for frontend
4. Configure and deploy

## CI/CD Setup

### GitHub Actions Workflow

Create `.github/workflows/ci-cd.yml`:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Python
      uses: actions/setup-python@v2
      with:
        python-version: 3.9
    
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r backend/requirements.txt
        pip install pytest pytest-cov
    
    - name: Run tests
      run: |
        pytest backend/tests/ --cov=backend --cov-report=xml
    
    - name: Upload coverage
      uses: codecov/codecov-action@v2

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: astropredict
        heroku_email: your-email@example.com
```

## Environment Setup

### Production Environment Variables

Create `.env` file in backend:

```
FLASK_APP=app.py
FLASK_ENV=production
DEBUG=False
PORT=5000
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=https://yourdomain.com
```

### Database Setup (Optional)

For production with database:

1. Add PostgreSQL support:
```bash
pip install Flask-SQLAlchemy psycopg2-binary
```

2. Update `app.py`:
```python
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy(app)

class Prediction(db.Model):
    id = db.Column(db.String(100), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    data = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
```

## SSL/HTTPS Setup

### Let's Encrypt (Free SSL)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

## Monitoring and Logging

### Cloud Logging

- **Heroku**: `heroku logs --tail`
- **AWS CloudWatch**: Configure in Console
- **Google Cloud**: Enabled by default

### Error Tracking

Add Sentry for error monitoring:

```python
import sentry_sdk
sentry_sdk.init("your-sentry-dsn")
```

## Performance Optimization

1. **Enable Caching**:
```python
from flask_caching import Cache
cache = Cache(app, config={'CACHE_TYPE': 'simple'})
```

2. **Use CDN for Frontend**:
   - CloudFront (AWS)
   - Cloudflare (Free)

3. **Database Indexing**:
```python
db.create_all()
```

## Troubleshooting

### Common Issues

**Port Already in Use**:
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>
```

**CORS Errors**:
- Ensure Flask-CORS is installed
- Check allowed origins in backend

**Module Not Found**:
```bash
pip install -r requirements.txt
pip freeze > requirements.txt  # Update if needed
```

**Deployment Fails**:
- Check logs: `heroku logs --tail`
- Verify environment variables
- Test locally first

### Getting Help

1. Check GitHub Issues
2. Review error logs
3. Consult documentation for your platform
4. Create new issue with details

## Security Checklist

- [ ] HTTPS enabled
- [ ] CSRF protection enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention (if using DB)
- [ ] Rate limiting configured
- [ ] Secrets not in version control
- [ ] CORS properly configured
- [ ] API authentication if needed

## Maintenance

### Regular Tasks

1. **Weekly**: Check logs for errors
2. **Monthly**: Update dependencies
3. **Quarterly**: Security audit
4. **Annually**: Review and optimize

### Backup Strategy

```bash
# Backup database (if using)
heroku pg:backups:capture --app astropredict
heroku pg:backups:download --app astropredict
```

---

For more help, visit the [AstroPredict Wiki](https://github.com/saonda63-sketch/astro1/wiki)
