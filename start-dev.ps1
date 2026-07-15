# start-dev.ps1 — convenience script for Windows
# Ensure Node.js and npm are installed first: https://nodejs.org/
# Usage: ./start-dev.ps1

Set-Location -Path "$PSScriptRoot"
if (-not (Test-Path -Path ".env")) {
  Write-Host "Warning: .env not found. Copy .env.example to .env and add GOOGLE_API_KEY before starting." -ForegroundColor Yellow
}

Write-Host "Installing dependencies (if needed)..."
npm install --no-audit --no-fund

Write-Host "Starting Next dev server..."
npm run dev
