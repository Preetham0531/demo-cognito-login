# Troubleshooting AWS Amplify Deployment

If your site at https://main.d3uqlp5vfeqw18.amplifyapp.com/ is not working, check these common issues:

## Issue 1: Missing Environment Variables (MOST COMMON)

**Symptoms:**
- Blank page
- Console errors about missing Cognito configuration
- "UserPoolId is required" errors

**Fix:**
1. Go to AWS Amplify Console → Your App → Environment variables
2. Add these environment variables:
   - `VITE_COGNITO_USER_POOL_ID` = your Cognito User Pool ID
   - `VITE_COGNITO_APP_CLIENT_ID` = your Cognito App Client ID
   - `VITE_AWS_REGION` = your AWS region (e.g., `us-east-1`)
   - `VITE_GOOGLE_OAUTH_CLIENT_ID` = your Google OAuth ID (optional)
3. Click "Save" and redeploy

## Issue 2: React Router Not Working (404 Errors)

**Symptoms:**
- Homepage loads but routes like `/login`, `/signup` show 404
- Routes work locally but not on Amplify

**Fix:**
The `amplify.yml` file now includes rewrite rules. Make sure it's pushed to GitHub and Amplify redeploys.

## Issue 3: Build Failures

**Symptoms:**
- Deployment shows "Build failed" in Amplify console

**Check:**
1. Go to Amplify Console → Your App → Build history
2. Click on the failed build to see error logs
3. Common issues:
   - Missing dependencies
   - TypeScript errors
   - Build command issues

**Fix:**
- Check the build logs for specific errors
- Ensure `package.json` has all dependencies
- Verify `npm run build` works locally

## Issue 4: CloudFront Cache

**Symptoms:**
- Changes not reflecting after deployment
- Old version still showing

**Fix:**
1. Go to Amplify Console → Your App
2. Click "Actions" → "Invalidate cache"
3. Wait a few minutes for cache to clear

## Issue 5: Cognito Callback URL Not Configured

**Symptoms:**
- OAuth/Google Sign-In fails
- Callback redirect errors

**Fix:**
1. Go to AWS Cognito Console → Your User Pool → App integration
2. Edit your App Client
3. Under "Allowed callback URLs", add:
   - `https://main.d3uqlp5vfeqw18.amplifyapp.com/auth/callback`
4. Save changes

## Quick Diagnostic Steps

1. **Check Amplify Console:**
   - Is the build successful? (Green checkmark)
   - Are environment variables set?
   - Check build logs for errors

2. **Check Browser Console:**
   - Open DevTools (F12)
   - Check Console tab for JavaScript errors
   - Check Network tab for failed requests

3. **Test Locally:**
   ```bash
   npm run build
   npm run preview
   ```
   If it works locally but not on Amplify, it's likely an environment variable issue.

4. **Verify Environment Variables:**
   - In Amplify Console → Environment variables
   - Make sure all VITE_* variables are set
   - No typos in variable names

## Most Likely Issue

Based on the deployment, **the most common issue is missing environment variables**. The app builds successfully but can't connect to Cognito because the User Pool ID and App Client ID aren't configured.

**Immediate Action:**
1. Go to AWS Amplify Console
2. Your App → Environment variables
3. Add all required variables
4. Save and wait for auto-redeploy (or manually trigger redeploy)

## Getting Help

If issues persist:
1. Check Amplify build/deploy logs
2. Check browser console for errors
3. Verify all environment variables are set correctly
4. Ensure Cognito User Pool is configured and active
