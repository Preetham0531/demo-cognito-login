import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { userPool } from '../config/cognito';
import type { CognitoUserSession } from 'amazon-cognito-identity-js';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

export const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError(`Authentication failed: ${errorParam}`);
      setLoading(false);
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    if (!code) {
      setError('No authorization code received');
      setLoading(false);
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    // Handle the OAuth callback
    // Note: For production, you would exchange the code for tokens on your backend
    // For now, we'll redirect to success since Cognito hosted UI handles the token exchange
    // The user should already be authenticated via Cognito's hosted UI
    
    // Store the code temporarily (in production, exchange this for tokens on backend)
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.getSession((err: any, session: CognitoUserSession | null) => {
        if (err || !session || !session.isValid()) {
          setError('Failed to retrieve session. Please try logging in again.');
          setLoading(false);
          setTimeout(() => navigate('/login'), 3000);
        } else {
          const idToken = session.getIdToken().getJwtToken();
          localStorage.setItem('cognitoToken', idToken);
          navigate('/success');
        }
      });
    } else {
      // If using Cognito Hosted UI, the session might already be set
      // Try to get session from the current user
      setTimeout(() => {
        const currentUser = userPool.getCurrentUser();
        if (currentUser) {
          currentUser.getSession((err: any, session: CognitoUserSession | null) => {
            if (err || !session || !session.isValid()) {
              setError('Session not found. Please try logging in again.');
              setLoading(false);
              setTimeout(() => navigate('/login'), 3000);
            } else {
              const idToken = session.getIdToken().getJwtToken();
              localStorage.setItem('cognitoToken', idToken);
              navigate('/success');
            }
          });
        } else {
          setError('Authentication completed but session not found. Please try logging in again.');
          setLoading(false);
          setTimeout(() => navigate('/login'), 3000);
        }
      }, 1000);
    }
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Completing authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
        <ErrorMessage message={error} className="mb-4" />
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    </div>
  );
};
