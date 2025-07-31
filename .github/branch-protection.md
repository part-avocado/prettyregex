# Branch Protection Configuration

To ensure code quality and prevent broken code from being merged, set up the following branch protection rules for the `main` branch:

## Required Status Checks
Enable the following status checks to pass before merging:
- `test` (from ci.yml workflow)
- `security` (from ci.yml workflow)
- `build` (from ci.yml workflow)
- `quick-checks` (from pr-checks.yml workflow)

## Branch Protection Settings
1. **Require a pull request before merging**
   - Enable: ✅
   - Require approvals: 1
   - Dismiss stale PR approvals when new commits are pushed: ✅

2. **Require status checks to pass before merging**
   - Enable: ✅
   - Require branches to be up to date before merging: ✅
   - Status checks that are required:
     - `test`
     - `security`
     - `build`
     - `quick-checks`

3. **Require conversation resolution before merging**
   - Enable: ✅

4. **Require signed commits**
   - Enable: ✅ (recommended for security)

5. **Require linear history**
   - Enable: ✅ (prevents merge commits)

6. **Include administrators**
   - Enable: ✅ (ensures even admins follow the rules)

## How to Configure
1. Go to your repository on GitHub
2. Navigate to Settings → Branches
3. Click "Add rule" or edit the existing rule for `main`
4. Configure the settings as listed above
5. Click "Create" or "Save changes"

This configuration ensures that:
- All code changes go through pull requests
- All tests must pass before merging
- Security audits are performed
- Code is properly built and validated
- No console.log statements or TODO comments are left in production code 