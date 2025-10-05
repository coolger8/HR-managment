#!/bin/bash

# HR Management System Setup Script
echo "🚀 Setting up HR Management System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Setup Backend
echo "📦 Installing backend dependencies..."
cd backend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

echo "✅ Backend dependencies installed"

# Setup Frontend
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

echo "✅ Frontend dependencies installed"

# Create environment files
echo "📝 Creating environment files..."

# Backend .env
cd ../backend
if [ ! -f .env ]; then
    cat > .env << EOL
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DATABASE_PATH=./hr_management.db
PORT=3001
EOL
    echo "✅ Created backend .env file"
fi

# Frontend .env.local
cd ../frontend
if [ ! -f .env.local ]; then
    cat > .env.local << EOL
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=HR Management System
EOL
    echo "✅ Created frontend .env.local file"
fi

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "🚀 To start the application:"
echo ""
echo "1. Start the backend (in one terminal):"
echo "   cd backend"
echo "   npm run start:dev"
echo ""
echo "2. Start the frontend (in another terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open your browser and go to: http://localhost:3000"
echo ""
echo "📚 For more information, check the README.md files"
echo ""