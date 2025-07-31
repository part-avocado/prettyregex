# Automated Release Setup Guide

This guide explains how to set up automated npm publishing and GitHub package creation for your repository.

## What's Been Set Up

### 1. GitHub Actions Workflows

- **`.github/workflows/ci.yml`** - Runs tests on pull requests and pushes
- **`.github/workflows/publish.yml`** - Publishes to npm and creates GitHub packages on version tags
- **`.github/workflows/dependabot.yml`** - Handles dependency updates

### 2. Release Automation

- **`scripts/release.js`** - Automated release script
- **`RELEASE.md`** - Complete release guide
- **NPM scripts** - `release:patch`, `release:minor`, `release:major`

### 3. Dependabot Configuration

- **`.github/dependabot.yml`** - Automatic dependency updates

## Setup Steps

### Step 1: NPM Authentication

1. **Create NPM Token:**
   ```bash
   # Go to npmjs.com → Profile → Access Tokens
   # Create new token with "Automation" type
   # Copy the token
   ```

2. **Add to GitHub Secrets:**
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Create new secret: `NPM_TOKEN`
   - Paste your NPM token

### Step 2: Repository Configuration

1. **Enable GitHub Actions:**
   - Go to your repo → Actions tab
   - Enable workflows if not already enabled

2. **Configure Branch Protection (Optional):**
   - Go to Settings → Branches
   - Add rule for `main` branch
   - Require status checks to pass before merging

### Step 3: Test the Setup

1. **Test CI:**
   ```bash
   # Make a small change and push
   git add .
   git commit -m "test: ci workflow"
   git push origin main
   ```

2. **Test Release (Optional):**
   ```bash
   # Run a patch release
   npm run release:patch
   ```

## How It Works

### Release Process

1. **Developer runs:** `npm run release:patch`
2. **Script automatically:**
   - Bumps version in `package.json`
   - Runs tests and linting
   - Commits changes
   - Creates git tag (e.g., `v1.0.5`)
   - Pushes to GitHub

3. **GitHub Actions automatically:**
   - Detects the version tag
   - Publishes to npm
   - Creates GitHub release
   - Adds package as release asset

### CI/CD Pipeline

- **On Pull Request:** Runs tests and linting
- **On Push to Main:** Runs tests and linting
- **On Version Tag:** Publishes to npm and creates GitHub package

## File Structure

```
.github/
├── workflows/
│   ├── ci.yml              # Continuous integration
│   ├── publish.yml         # NPM publishing
│   └── dependabot.yml      # Dependency updates
└── dependabot.yml          # Dependabot configuration

scripts/
└── release.js              # Release automation script

RELEASE.md                  # Release guide
SETUP.md                    # This file
```

## Customization

### Modify Release Process

Edit `scripts/release.js` to:
- Add custom validation steps
- Change commit message format
- Add pre-release checks

### Modify GitHub Actions

Edit `.github/workflows/publish.yml` to:
- Change Node.js version
- Add custom build steps
- Modify release notes format

### Modify Dependabot

Edit `.github/dependabot.yml` to:
- Change update frequency
- Add custom reviewers
- Modify labels

## Troubleshooting

### Common Issues

1. **"NPM_TOKEN not found"**
   - Check GitHub secrets configuration
   - Ensure token has publish permissions

2. **"Package already exists"**
   - Version already published on npm
   - Bump version and retry

3. **"Tests failing"**
   - Fix failing tests before releasing
   - Check CI logs for details

### Debug Workflows

1. **Check Actions Tab:**
   - Go to GitHub repo → Actions
   - Click on failed workflow
   - Check logs for errors

2. **Local Testing:**
   ```bash
   # Test release script locally
   node scripts/release.js patch
   
   # Test npm publish (dry run)
   npm publish --dry-run
   ```

## Security Considerations

- ✅ NPM token stored in GitHub secrets
- ✅ No sensitive data in repository
- ✅ Minimal token permissions
- ✅ Automated security updates via Dependabot

## Next Steps

1. **Set up NPM token** (see Step 1 above)
2. **Test the CI workflow** with a small change
3. **Try a release** with `npm run release:patch`
4. **Monitor the process** in GitHub Actions
5. **Customize** as needed for your project

## Support

If you encounter issues:
1. Check the GitHub Actions logs
2. Review the troubleshooting section
3. Open an issue on GitHub
4. Check the [RELEASE.md](RELEASE.md) for detailed release information

---

Your automated release system is now ready! 🚀 