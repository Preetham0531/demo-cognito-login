# AWS Cognito Login Page Demo

A complete authentication application built with React, TypeScript, and AWS Cognito, featuring user registration, login with MFA, password reset, and Google OAuth integration.

## Features

- **User Registration**: Sign up with email, password, name, and optional phone number
- **Login**: Email/password authentication with MFA support
- **Google OAuth**: Sign in with Google account
- **Forgot Password**: Multi-step password reset flow
  - Enter email address
  - Verify code sent to email
  - Set new password
  - Auto-login after password reset
- **Success Page**: Displays login success message with logout functionality

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- AWS Cognito User Pool configured
- Google OAuth Client ID (if using Google Sign-In)

## Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Create a `.env` file in the root directory with your Cognito configuration:
   ```env
   VITE_COGNITO_USER_POOL_ID=your-user-pool-id
   VITE_COGNITO_APP_CLIENT_ID=your-app-client-id
   VITE_AWS_REGION=us-east-1
   VITE_GOOGLE_OAUTH_CLIENT_ID=your-google-oauth-client-id
   ```

   You can find these values in your AWS Cognito console:
   - **User Pool ID**: Found in the User Pool overview page
   - **App Client ID**: Found under "App integration" > "App clients"
   - **Region**: The AWS region where your User Pool is created
   - **Google OAuth Client ID**: Required if you've configured Google as an identity provider in Cognito

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## AWS Cognito Configuration

### User Pool Setup

1. Create a User Pool in AWS Cognito
2. Enable email as a sign-in option
3. Configure password policy (minimum 8 characters recommended)
4. Set up MFA (optional but recommended)
5. Configure email verification

### Google OAuth Setup

1. In your Cognito User Pool, go to "Sign-in experience" > "Federated identity provider sign-in"
2. Add Google as an identity provider
3. Configure your Google OAuth credentials
4. **Configure the return URL (callback URL):**
   - For development: `http://localhost:5173/auth/callback`
   - For production: `https://yourdomain.com/auth/callback`
   - Add both URLs to "Allowed callback URLs" in your App Client settings

### App Client Configuration

1. Create an App Client in your User Pool
2. Enable the following authentication flows:
   - ALLOW_USER_PASSWORD_AUTH
   - ALLOW_REFRESH_TOKEN_AUTH
3. Configure OAuth settings:
   - Allowed OAuth flows: Authorization code grant
   - Allowed OAuth scopes: email, openid, profile
   - **Allowed callback URLs** (this is your return URL):
     - Development: `http://localhost:5173/auth/callback`
     - Production: `https://yourdomain.com/auth/callback`
     - Add each URL on a new line or comma-separated

## Project Structure

```
src/
  components/          # Reusable UI components
    - LoginForm.tsx
    - SignUpForm.tsx
    - ForgotPasswordForm.tsx
    - MFAInput.tsx
    - GoogleSignInButton.tsx
    - ErrorMessage.tsx
    - LoadingSpinner.tsx
  pages/               # Page components
    - LoginPage.tsx
    - SignUpPage.tsx
    - ForgotPasswordPage.tsx
    - SuccessPage.tsx
  services/            # Business logic
    - cognitoAuth.ts
  utils/               # Utility functions
    - validation.ts
    - constants.ts
  config/              # Configuration
    - cognito.ts
  contexts/            # React contexts
    - AuthContext.tsx
```

## Routes

- `/login` - Login page
- `/signup` - Registration page
- `/forgot-password` - Password reset flow
- `/success` - Success page after login
- `/` - Redirects to `/login`

## Password Requirements

Passwords must meet the following criteria:
- At least 8 characters long
- Contains at least one uppercase letter
- Contains at least one lowercase letter
- Contains at least one number
- Contains at least one special character

## Error Handling

The application includes comprehensive error handling for:
- Network errors
- Invalid credentials
- MFA code verification failures
- Password reset errors
- User-friendly error messages for all Cognito error codes

## Security Notes

- Tokens are stored in localStorage (consider using httpOnly cookies for production)
- Never commit `.env` files to version control
- Ensure your Cognito User Pool has appropriate security policies
- Use HTTPS in production environments

## Development

The application uses:
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for routing
- **Amazon Cognito Identity JS** for authentication

## Troubleshooting

### Google OAuth not working
- Verify Google is configured as an identity provider in Cognito
- Check callback URLs are correctly configured
- Ensure Google OAuth Client ID is correct

### MFA not working
- Verify MFA is enabled in your Cognito User Pool
- Check that users have verified their phone/email for MFA

### Environment variables not loading
- Ensure variables start with `VITE_` prefix
- Restart the development server after changing `.env` file
- Check that `.env` file is in the project root

## License

MIT