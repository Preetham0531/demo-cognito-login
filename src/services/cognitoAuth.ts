import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import { userPool } from '../config/cognito';
import { getErrorMessage } from '../utils/constants';

export interface SignUpParams {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface LoginParams {
  email: string;
  password: string;
}

export const signUp = (params: SignUpParams): Promise<string> => {
  return new Promise((resolve, reject) => {
    const attributes: CognitoUserAttribute[] = [
      new CognitoUserAttribute({ Name: 'email', Value: params.email }),
      new CognitoUserAttribute({ Name: 'name', Value: params.name }),
    ];

    if (params.phone) {
      attributes.push(new CognitoUserAttribute({ Name: 'phone_number', Value: params.phone }));
    }

    userPool.signUp(
      params.email,
      params.password,
      attributes,
      [],
      (err, result) => {
        if (err) {
          reject(new Error(getErrorMessage(err)));
          return;
        }
        resolve(result?.user.getUsername() || '');
      }
    );
  });
};

export const confirmSignUp = (email: string, code: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.confirmRegistration(code, true, (err) => {
      if (err) {
        reject(new Error(getErrorMessage(err)));
        return;
      }
      resolve();
    });
  });
};

let mfaUser: CognitoUser | null = null;

export const login = (params: LoginParams): Promise<any> => {
  return new Promise((resolve, reject) => {
    const authenticationDetails = new AuthenticationDetails({
      Username: params.email,
      Password: params.password,
    });

    const cognitoUser = new CognitoUser({
      Username: params.email,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        mfaUser = null;
        resolve({
          accessToken: result.getAccessToken().getJwtToken(),
          idToken: result.getIdToken().getJwtToken(),
          refreshToken: result.getRefreshToken().getToken(),
        });
      },
      onFailure: (err) => {
        mfaUser = null;
        reject(new Error(getErrorMessage(err)));
      },
      mfaRequired: (challengeName, challengeParameters) => {
        mfaUser = cognitoUser;
        resolve({
          challengeName,
          challengeParameters,
          requiresMFA: true,
        });
      },
      newPasswordRequired: (userAttributes, requiredAttributes) => {
        mfaUser = null;
        resolve({
          requiresNewPassword: true,
          userAttributes,
          requiredAttributes,
        });
      },
    });
  });
};

export const respondToMfaChallenge = (
  code: string
): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!mfaUser) {
      reject(new Error('MFA session expired. Please login again.'));
      return;
    }

    mfaUser.sendMFACode(code, {
      onSuccess: (result) => {
        mfaUser = null;
        resolve({
          accessToken: result.getAccessToken().getJwtToken(),
          idToken: result.getIdToken().getJwtToken(),
          refreshToken: result.getRefreshToken().getToken(),
        });
      },
      onFailure: (err) => {
        mfaUser = null;
        reject(new Error(getErrorMessage(err)));
      },
    });
  });
};

export const forgotPassword = (email: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.forgotPassword({
      onSuccess: () => {
        resolve();
      },
      onFailure: (err) => {
        reject(new Error(getErrorMessage(err)));
      },
    });
  });
};

export const confirmForgotPassword = (
  email: string,
  code: string,
  newPassword: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: () => {
        resolve();
      },
      onFailure: (err) => {
        reject(new Error(getErrorMessage(err)));
      },
    });
  });
};

export const loginAfterPasswordReset = (email: string, password: string): Promise<any> => {
  return login({ email, password });
};

export const signInWithGoogle = (): void => {
  const userPoolId = userPool.getUserPoolId();
  const region = userPoolId.split('_')[0];
  const domain = `cognito-idp.${region}.amazonaws.com`;
  const clientId = userPool.getClientId();
  const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`);
  const responseType = 'code';
  const scope = encodeURIComponent('email openid profile');
  
  const googleAuthUrl = `https://${domain}/oauth2/authorize?` +
    `identity_provider=Google&` +
    `redirect_uri=${redirectUri}&` +
    `response_type=${responseType}&` +
    `client_id=${clientId}&` +
    `scope=${scope}`;

  window.location.href = googleAuthUrl;
};

export const logout = (): void => {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
  }
  localStorage.removeItem('cognitoToken');
  sessionStorage.removeItem('cognitoToken');
};
