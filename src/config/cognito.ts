import { CognitoUserPool, CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID || '',
  ClientId: import.meta.env.VITE_COGNITO_APP_CLIENT_ID || '',
};

export const userPool = new CognitoUserPool(poolData);

export const region = import.meta.env.VITE_AWS_REGION || 'us-east-1';
export const googleOAuthClientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID || '';

export { CognitoUser, AuthenticationDetails, CognitoUserAttribute };
