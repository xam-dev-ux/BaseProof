#!/bin/bash

echo "🛡️  BaseProof Installation Script"
echo "=================================="
echo ""

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install contracts dependencies
echo "📦 Installing contracts dependencies..."
cd contracts && npm install && cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo ""
echo "✅ Installation complete!"
echo ""
echo "📋 Next steps:"
echo "  1. Copy .env.example to .env and configure"
echo "  2. Deploy smart contract: cd contracts && npm run deploy"
echo "  3. Update frontend .env with contract address"
echo "  4. Start development: cd frontend && npm run dev"
echo ""
echo "📚 Documentation:"
echo "  - Setup Guide: docs/SETUP.md"
echo "  - User Guide: docs/USER_GUIDE.md"
echo "  - Deployment: docs/DEPLOYMENT.md"
echo ""
echo "🚀 Happy building with BaseProof!"
