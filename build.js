#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Expo web app for production...');
console.log('Node version:', process.version);
console.log('Working directory:', process.cwd());

try {
  // Clear any existing dist directory
  const distPath = path.join(process.cwd(), 'dist');
  if (fs.existsSync(distPath)) {
    console.log('🧹 Cleaning existing dist directory...');
    execSync('rm -rf dist', { stdio: 'inherit' });
  }
  
  // Set environment
  process.env.NODE_ENV = 'production';
  
  console.log('📦 Running Expo export...');
  // Run expo export for web with verbose output
  execSync('npx expo export --platform web --clear', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  
  // Check if dist directory exists
  if (!fs.existsSync(distPath)) {
    throw new Error('Build failed: dist directory not created');
  }
  
  // Verify essential files exist
  const indexPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    throw new Error('Build failed: index.html not found in dist');
  }
  
  console.log('✅ Build completed successfully!');
  console.log('📁 Output directory:', distPath);
  
  // List files in dist directory
  const files = fs.readdirSync(distPath);
  console.log('📄 Generated files:', files);
  
  // Check file sizes
  files.forEach(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    if (stats.isFile()) {
      console.log(`   ${file}: ${(stats.size / 1024).toFixed(2)} KB`);
    }
  });
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.error('Stack trace:', error.stack);
  process.exit(1);
}