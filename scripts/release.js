#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the release type from command line arguments
const releaseType = process.argv[2];

if (!releaseType || !['patch', 'minor', 'major'].includes(releaseType)) {
  console.error('Usage: node scripts/release.js <patch|minor|major>');
  console.error('  patch: 1.0.0 -> 1.0.1 (bug fixes)');
  console.error('  minor: 1.0.0 -> 1.1.0 (new features)');
  console.error('  major: 1.0.0 -> 2.0.0 (breaking changes)');
  process.exit(1);
}

try {
  // Read current package.json
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const currentVersion = packageJson.version;
  
  console.log(`Current version: ${currentVersion}`);
  console.log(`Release type: ${releaseType}`);
  
  // Bump version
  console.log('\n📦 Bumping version...');
  execSync(`npm version ${releaseType} --no-git-tag-version`, { stdio: 'inherit' });
  
  // Read new version
  const newPackageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const newVersion = newPackageJson.version;
  
  console.log(`New version: ${newVersion}`);
  
  // Run tests
  console.log('\n🧪 Running tests...');
  execSync('npm test', { stdio: 'inherit' });
  
  // Run linting
  console.log('\n🔍 Running linting...');
  execSync('npm run lint', { stdio: 'inherit' });
  
  // Commit changes
  console.log('\n💾 Committing changes...');
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "chore: bump version to ${newVersion}"`, { stdio: 'inherit' });
  
  // Create and push tag
  console.log('\n🏷️ Creating and pushing tag...');
  execSync(`git tag v${newVersion}`, { stdio: 'inherit' });
  execSync('git push origin main', { stdio: 'inherit' });
  execSync(`git push origin v${newVersion}`, { stdio: 'inherit' });
  
  console.log('\n✅ Release process completed!');
  console.log(`\n📋 Next steps:`);
  console.log(`1. GitHub Actions will automatically:`);
  console.log(`   - Publish to npm as version ${newVersion}`);
  console.log(`   - Create a GitHub release`);
  console.log(`   - Add the package as a release asset`);
  console.log(`\n2. Monitor the workflow at: https://github.com/prettyregex/pretty-regex/actions`);
  console.log(`\n3. Check the release at: https://github.com/prettyregex/pretty-regex/releases`);
  
} catch (error) {
  console.error('\n❌ Release failed:', error.message);
  process.exit(1);
} 