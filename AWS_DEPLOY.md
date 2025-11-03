# Deploy to AWS Amplify (AWS Only - No Vercel Needed!)

Since you're already using AWS Cognito, you can deploy directly to **AWS Amplify** - keeping everything in the AWS ecosystem.

## Quick Steps to Deploy to AWS Amplify

### 1. Go to AWS Amplify Console
- Sign in to AWS Console: https://console.aws.amazon.com
- Search for "Amplify" or go to: https://console.aws.amazon.com/amplify

### 2. Create New App
1. Click **"New app"** > **"Host web app"**
2. Select **"GitHub"** as your source
3. Authorize AWS to access your GitHub if prompted
4. Select repository: **`Preetham0531/demo-cognito-login`**
5. Select branch: **`main`**

### 3. Configure Build Settings
AWS Amplify will auto-detect the `amplify.yml` file we created. The build settings should be:
- Build command: `npm run build`
- Output directory: `dist`

### 4. Add Environment Variables
Click "Advanced settings" or find "Environment variables" section and add:
- `VITE_COGNITO_USER_POOL_ID` = your Cognito User Pool ID
- `VITE_COGNITO_APP_CLIENT_ID` = your Cognito App Client ID
- `VITE_AWS_REGION` = your AWS region (e.g., `us-east-1`)
- `VITE_GOOGLE_OAUTH_CLIENT_ID` = your Google OAuth ID (optional)

### 5. Deploy
Click **"Save and deploy"**

Your app will be live at: `https://main.{app-id}.amplifyapp.com`

## After Deployment - Update Cognito

1. Copy your Amplify app URL (e.g., `https://main.abc123xyz.amplifyapp.com`)

2. **Update Cognito Callback URL:**
   - Go to AWS Cognito Console → Your User Pool → App integration
   - Edit your App Client
   - Under "Allowed callback URLs", add:
     - `https://main.{app-id}.amplifyapp.com/auth/callback`
   - Save changes

## Benefits of Using AWS Amplify

✅ **Everything in AWS** - No need for external services  
✅ **Free tier** - Generous free tier for hosting  
✅ **Easy integration** - Works seamlessly with Cognito  
✅ **Auto deployments** - Automatically deploys on git push  
✅ **Custom domain** - Easy to add your own domain  
✅ **CI/CD built-in** - Automatic builds and deployments  

## That's It!

Your app will be fully hosted on AWS - no Vercel, Netlify, or any other service needed!
