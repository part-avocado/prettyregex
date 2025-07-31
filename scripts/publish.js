const { execSync } = require('child_process');
const fs = require('fs');

// Backup original package.json
const originalPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));

try {
  // Publish to GitHub Packages
  console.log('Publishing to GitHub Packages...');
  execSync('npm publish', { stdio: 'inherit' });
  
  // Create npm version
  const npmPackage = { ...originalPackage };
  npmPackage.name = 'pretty-regex';
  delete npmPackage.publishConfig;
  
  // Write npm package.json
  fs.writeFileSync('package.json', JSON.stringify(npmPackage, null, 2));
  
  // Publish to npm
  console.log('Publishing to npm...');
  execSync('npm publish --registry=https://registry.npmjs.org/', { stdio: 'inherit' });
  
  console.log('Successfully published to both registries!');
} catch (error) {
  console.error('Error publishing:', error.message);
} finally {
  // Restore original package.json
  fs.writeFileSync('package.json', JSON.stringify(originalPackage, null, 2));
}