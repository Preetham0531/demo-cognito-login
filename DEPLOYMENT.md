# Deployment Guide

This guide will help you deploy your AWS Cognito Login Page application online.

## Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard:
     - `VITE_COGNITO_USER_POOL_ID`
     - `VITE_COGNITO_APP_CLIENT_ID`
     - `VITE_AWS_REGION`
     - `VITE_GOOGLE_OAUTH_CLIENT_ID` (optional)
   - Click "Deploy"
   - Update Cognito callback URLs with your Vercel domain

### Option 2: Netlify

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign in with GitHub
   - Click "Add new site" > "Import an existing project"
   - Select your GitHub repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add environment variables in Site settings > Environment variables:
     - `VITE_COGNITO_USER_POOL_ID`
     - `VITE_COGNITO_APP_CLIENT_ID`
     - `VITE_AWS_REGION`
     - `VITE_GOOGLE_OAUTH_CLIENT_ID` (optional)
   - Click "Deploy site"
   - Update Cognito callback URLs with your Netlify domain

### Option 3: AWS Amplify (AWS Native)

1. **Push to GitHub** (same as above)

2. **Deploy to AWS Amplify:**
   - Go to AWS Console > Amplify
   - Click "New app" > "Host web app"
   - Connect your GitHub repository
   - Build settings:
     ```yaml
     version: 1
     frontend:
       phases:
         preBuild:
           commands:
             - npm install
         build:
           commands:
             - npm run build
       artifacts:
         baseDirectory: dist
         files:
           - '**/*'
       cache:
         paths:
           - node_modules/**/*
     ```
   - Add environment variables in Amplify console
   - Deploy
   - Update Cognito callback URLs with your Amplify domain

## Important: Update Cognito Configuration

After deployment, you MUST update your AWS Cognito settings:

1. Go to AWS Cognito Console > Your User Pool > App integration
2. Edit your App Client
3. Under "Allowed callback URLs", add:
   - Your production URL: `https://your-domain.vercel.app/auth/callback`
   - Or: `https://your-site.netlify.app/auth/callback`
   - Or: `https://your-app-id.amplifyapp.com/auth/callback`
4. Save changes

## Environment Variables

Set these in your deployment platform's environment variables section:

- `VITE_COGNITO_USER_POOL_ID` - Your Cognito User Pool ID
- `VITE_COGNITO_APP_CLIENT_ID` - Your Cognito App Client ID  
- `VITE_AWS_REGION` - AWS region (e.g., `us-east-1`)
- `VITE_GOOGLE_OAUTH_CLIENT_ID` - Google OAuth Client ID (optional)

## Troubleshooting

- **Build fails**: Check that all environment variables are set
- **OAuth not working**: Verify callback URLs match exactly in Cognito
- **404 errors**: Ensure SPA routing is configured (rewrite rules)
- **CORS errors**: Check Cognito domain settings allow your production domain

## Testing Deployment

1. Visit your deployed URL
2. Try signing up
3. Try logging in
4. Test forgot password flow
5. Test Google OAuth (if configured)
