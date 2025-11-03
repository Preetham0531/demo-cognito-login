import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { userPool } from '../config/cognito';
import { CognitoUser } from 'amazon-cognito-identity-js';

interface AuthContextType {
  isAuthenticated: boolean;
  user: CognitoUser | null;
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<CognitoUser | null>(null);

  const checkAuth = () => {
    try {
      const cognitoUser = userPool.getCurrentUser();
      if (cognitoUser) {
        cognitoUser.getSession((err: any, session: any) => {
          if (err || !session?.isValid()) {
            setIsAuthenticated(false);
            setUser(null);
          } else {
            setIsAuthenticated(true);
            setUser(cognitoUser);
          }
        });
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      // If Cognito is not configured, just set unauthenticated
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
