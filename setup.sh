#!/bin/bash
# Quick Start Script for AstroPredict

echo "🌟 AstroPredict - Quick Start Setup"
echo "===================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Setup Backend
echo "📦 Setting up Backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

echo "✅ Backend setup complete!"
echo ""

# Setup Frontend
cd ../frontend
echo "🎨 Frontend is ready!"
echo "    - All files are in ./frontend/"
echo "    - Serve with: python -m http.server 8000"
echo ""

# Back to root
cd ..

echo "🚀 To start development:"
echo "   1. Terminal 1 - Backend:"
echo "      cd backend"
echo "      source venv/bin/activate  # On Windows: venv\\Scripts\\activate"
echo "      python app.py"
echo ""
echo "   2. Terminal 2 - Frontend:"
echo "      cd frontend"
echo "      python -m http.server 8000"
echo ""
echo "   3. Open browser:"
echo "      http://localhost:8000"
echo ""
echo "📚 Documentation:"
echo "   - API: docs/API.md"
echo "   - Deployment: DEPLOYMENT_GUIDE.md"
echo "   - Contributing: docs/CONTRIBUTING.md"
echo ""
echo "✨ Happy coding!"
