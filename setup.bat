@echo off
REM Quick Start Script for AstroPredict (Windows)

echo 🌟 AstroPredict - Quick Start Setup
echo ====================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    exit /b 1
)

REM Setup Backend
echo 📦 Setting up Backend...
cd backend

REM Create virtual environment
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

echo ✅ Backend setup complete!
echo.

REM Setup Frontend
cd ..\frontend
echo 🎨 Frontend is ready!
echo    - All files are in .\frontend\
echo    - Serve with: python -m http.server 8000
echo.

REM Back to root
cd ..

echo 🚀 To start development:
echo    1. Terminal 1 - Backend:
echo       cd backend
echo       venv\Scripts\activate
echo       python app.py
echo.
echo    2. Terminal 2 - Frontend:
echo       cd frontend
echo       python -m http.server 8000
echo.
echo    3. Open browser:
echo       http://localhost:8000
echo.
echo 📚 Documentation:
echo    - API: docs\API.md
echo    - Deployment: DEPLOYMENT_GUIDE.md
echo    - Contributing: docs\CONTRIBUTING.md
echo.
echo ✨ Happy coding!
