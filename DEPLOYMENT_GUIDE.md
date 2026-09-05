# 🚀 Deployment Guide: GitHub + Vercel

This guide will help you deploy the Cocktail Wizard app to Vercel with automatic deployments from GitHub.

## Step 1: Create a GitHub Repository

### Option A: Using GitHub Web UI (Recommended)

1. Go to https://github.com/new
2. Create repository named: **cocktail-wizard** (or your preferred name)
3. Choose:
   - Description: "A smart cocktail discovery app with recipe suggestions"
   - Public (so it's accessible to everyone)
   - Don't initialize with README/gitignore (we have them)
4. Click "Create repository"

### Option B: Using GitHub CLI (if you have it)

```bash
gh repo create cocktail-wizard --public --source=. --remote=origin --push
```

## Step 2: Push Your Code to GitHub

After creating the repository on GitHub, run these commands:

```bash
cd "C:\Users\dutt_\Quiz Game\cocktail-app"

# Add the remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/cocktail-wizard.git

# Rename branch to main (GitHub default)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

✅ Your code is now on GitHub!

## Step 3: Deploy to Vercel

### Step 3a: Sign Up for Vercel

1. Go to https://vercel.com/signup
2. Sign up with GitHub (easiest option)
3. Authorize Vercel to access your GitHub account

### Step 3b: Import Project

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select "Import Git Repository"
4. Find and select **cocktail-wizard** repository
5. Click "Import"

### Step 3c: Configure Project

1. **Framework Preset**: Select "Vite"
2. **Build Command**: Keep as `npm run build`
3. **Output Directory**: Keep as `dist`
4. **Environment Variables**: Add these:
   ```
   VITE_CLAUDE_API_KEY=sk-ant-... (your Claude API key, optional)
   ```
5. Click "Deploy"

✅ Your app is now live on Vercel!

## Step 4: Enable Auto-Deployments

Vercel automatically deploys whenever you push to GitHub. To test:

1. Make a small change to your code
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test auto-deployment"
   git push
   ```
3. Go to https://vercel.com/dashboard and watch it deploy automatically! 🎉

## Step 5: Add a Custom Domain (Optional)

1. Go to Vercel Project Settings → "Domains"
2. Add your custom domain (costs ~$10-15/year)
3. Follow Vercel's DNS instructions

## Useful Links

- **GitHub Repository**: https://github.com/YOUR_USERNAME/cocktail-wizard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Live App**: https://cocktail-wizard.vercel.app (or your custom domain)

## Making Changes

### Workflow for Updates:

1. **Make code changes** in your editor
2. **Test locally**: `npm run dev`
3. **Commit to git**:
   ```bash
   git add .
   git commit -m "Description of changes"
   ```
4. **Push to GitHub**:
   ```bash
   git push
   ```
5. **Vercel deploys automatically** (2-3 minutes)
6. **Check your live site** at vercel.app URL

## Troubleshooting

### Build Fails on Vercel

**Error**: "npm ERR! code ERESOLVE"

**Solution**: Vercel uses npm 7+. Make sure `package-lock.json` is committed:
```bash
git add package-lock.json
git commit -m "Ensure package-lock.json"
git push
```

### Environment Variables Not Working

1. Go to Vercel Project Settings → "Environment Variables"
2. Add: `VITE_CLAUDE_API_KEY` = `sk-ant-...`
3. Redeploy the project

### Site Shows Blank Page

1. Check "Deployments" tab in Vercel for build errors
2. Check browser console (F12) for JavaScript errors
3. Check "Functions" logs if using serverless functions

## Cost Analysis

- **GitHub**: FREE (unlimited public repos)
- **Vercel**: FREE tier includes:
  - Unlimited deployments
  - Automatic HTTPS
  - 100 GB bandwidth/month
  - 12 serverless function invocations/month
  - **Perfect for this app!**

## Next Steps

1. ✅ Push to GitHub
2. ✅ Deploy to Vercel
3. Share your live link with others!
4. Make changes instantly (just push to GitHub)
5. Monitor deployments in Vercel dashboard

---

**Questions?** Check Vercel and GitHub documentation or contact support.

🚀 Happy Deploying!
