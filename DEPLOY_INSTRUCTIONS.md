# Quick Deploy Instructions

## Code is already pushed to GitHub ✅
Repository: https://github.com/Preetham0531/demo-cognito-login

## Deploy to Vercel (Recommended - 2 minutes)

### Option 1: Web Interface (Easiest)
1. Go to https://vercel.com/new
2. Sign in with GitHub
3. Click "Import Project"
4. Select `demo-cognito-login` repository
5. Add these environment variables:
   - `VITE_COGNITO_USER_POOL_ID` = your Cognito User Pool ID
   - `VITE_COGNITO_APP_CLIENT_ID` = your Cognito App Client ID
   - `VITE_AWS_REGION` = us-east-1 (or your region)
   - `VITE_GOOGLE_OAUTH_CLIENT_ID` = your Google OAuth ID (optional)
6. Click "Deploy"
7. Your app will be live at: `https://demo-cognito-login.vercel.app` (or similar)

### Option 2: CLI
```bash
cd /Users/preethambindela/cognito-login-page-demo
vercel login
vercel --prod
```

## After Deployment - IMPORTANT!

1. **Copy your Vercel deployment URL** (e.g., `https://demo-cognito-login-xxx.vercel.app`)

2. **Update Cognito Callback URLs:**
   - Go to AWS Cognito Console → Your User Pool → App integration
   - Edit your App Client
   - Under "Allowed callback URLs", add:
     - `https://your-vercel-url.vercel.app/auth/callback`
   - Save changes

3. **Test your deployment:**
   - Visit your Vercel URL
   - Try signing up
   - Test login
   - Test forgot password
   - Test Google OAuth (if configured)

## Environment Variables Needed

Make sure you have these values ready:
- Cognito User Pool ID
- Cognito App Client ID
- AWS Region (default: us-east-1)
- Google OAuth Client ID (optional, only if using Google Sign-In)
