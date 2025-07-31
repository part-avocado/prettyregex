#!/usr/bin/env node

/**
 * Build script for Pretty RegEx
 * Performs validation and build-time checks
 */

const fs = require('fs');
const path = require('path');

console.log('🔨 Building Pretty RegEx...');

// Check if package.json exists and is valid
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('✅ Package.json is valid');
  
  // Check required fields
  const requiredFields = ['name', 'version', 'main', 'types'];
  for (const field of requiredFields) {
    if (!packageJson[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  console.log('✅ All required package.json fields present');
  
} catch (error) {
  console.error('❌ Package.json validation failed:', error.message);
  process.exit(1);
}

// Check if main files exist
const mainFiles = [
  'src/index.js',
  'src/index.d.ts',
  'src/errors.js',
  'src/validator.js',
  'src/advanced.js'
];

for (const file of mainFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Missing required file: ${file}`);
    process.exit(1);
  }
}
console.log('✅ All main files present');

// Check if tests exist
if (!fs.existsSync('tests/')) {
  console.error('❌ Missing tests directory');
  process.exit(1);
}
console.log('✅ Tests directory present');

// Validate TypeScript definitions
try {
  const typeDefs = fs.readFileSync('src/index.d.ts', 'utf8');
  if (!typeDefs.includes('export default class PrettyRegex')) {
    throw new Error('Missing PrettyRegex class export');
  }
  console.log('✅ TypeScript definitions valid');
} catch (error) {
  console.error('❌ TypeScript definitions validation failed:', error.message);
  process.exit(1);
}

// Test npm pack (dry run)
try {
  const { execSync } = require('child_process');
  execSync('npm pack --dry-run', { stdio: 'pipe' });
  console.log('✅ npm pack dry-run successful');
} catch (error) {
  console.error('❌ npm pack dry-run failed:', error.message);
  process.exit(1);
}

console.log('🎉 Build completed successfully!'); 