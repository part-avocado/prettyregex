# Release Guide

This guide explains how to release new versions of PRX-RegEx using our automated release system.

## Prerequisites

Before you can release, you need to set up the following:

### 1. NPM Token
You need an NPM authentication token to publish packages:

1. Go to [npmjs.com](https://www.npmjs.com) and log in
2. Go to your profile settings
3. Click on "Access Tokens"
4. Create a new token with "Automation" type
5. Copy the token

### 2. GitHub Secrets
Add the NPM token to your GitHub repository secrets:

1. Go to your GitHub repository
2. Click on "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Your NPM token from step 1

## Release Process

### Automatic Release (Recommended)

The easiest way to release is using our automated scripts:

```bash
# For bug fixes (1.0.0 → 1.0.1)
npm run release:patch

# For new features (1.0.0 → 1.1.0)
npm run release:minor

# For breaking changes (1.0.0 → 2.0.0)
npm run release:major
```

### What Happens Automatically

When you run a release script, it will:

1. ✅ Bump the version in `package.json`
2. ✅ Run tests to ensure everything works
3. ✅ Run linting to check code quality
4. ✅ Commit the version bump
5. ✅ Create a git tag (e.g., `v1.0.5`)
6. ✅ Push the commit and tag to GitHub

Once the tag is pushed, GitHub Actions will automatically:

1. 🚀 Publish the package to NPM
2. 📦 Create a GitHub release
3. 📁 Add the package as a release asset
4. 🏷️ Tag the release with the version number

### Manual Release

If you prefer to do it manually:

```bash
# 1. Bump version
npm version patch  # or minor, major

# 2. Run tests
npm test

# 3. Commit and push
git add .
git commit -m "chore: bump version to X.Y.Z"
git push origin main

# 4. Create and push tag
git tag vX.Y.Z
git push origin vX.Y.Z
```

## Version Numbers

We follow [Semantic Versioning](https://semver.org/):

- **Patch** (`1.0.0` → `1.0.1`): Bug fixes, no breaking changes
- **Minor** (`1.0.0` → `1.1.0`): New features, backward compatible
- **Major** (`1.0.0` → `2.0.0`): Breaking changes

## Monitoring Releases

After triggering a release, you can monitor the process:

1. **GitHub Actions**: https://github.com/prettyregex/pretty-regex/actions
2. **NPM Package**: https://www.npmjs.com/package/prx-regex
3. **GitHub Releases**: https://github.com/prettyregex/pretty-regex/releases

## Troubleshooting

### Release Fails

If the release fails:

1. Check the GitHub Actions logs for errors
2. Ensure your NPM token is valid and has publish permissions
3. Verify the package name isn't already taken on NPM
4. Make sure all tests pass locally

### Common Issues

**"Package name already exists"**
- The version you're trying to publish already exists on NPM
- Bump the version number and try again

**"Authentication failed"**
- Your NPM token is invalid or expired
- Generate a new token and update the GitHub secret

**"Tests failing"**
- Fix any failing tests before releasing
- Run `npm test` locally to verify

## Pre-release Testing

Before releasing, you can test the package locally:

```bash
# Build and test locally
npm run build
npm test

# Test installation
npm pack
npm install ./prx-regex-X.Y.Z.tgz
```

## Release Notes

When a release is created, it will include:

- Version number
- Installation instructions
- Link to CHANGELOG.md

You can manually edit the release notes on GitHub after the release is created.

## Security

- Never commit your NPM token to the repository
- Use GitHub secrets to store sensitive information
- Regularly rotate your NPM token
- Only give the token the minimum required permissions

---

For questions or issues with releases, please open an issue on GitHub. 