import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ConfigError } from './components/ConfigError';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { SuccessPage } from './pages/SuccessPage';
import { OAuthCallbackPage } from './pages/OAuthCallbackPage';

function App() {
  // Check for required environment variables
  const hasRequiredConfig = 
    import.meta.env.VITE_COGNITO_USER_POOL_ID && 
    import.meta.env.VITE_COGNITO_APP_CLIENT_ID;

  if (!hasRequiredConfig) {
    return <ConfigError />;
  }

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/auth/callback" element={<OAuthCallbackPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;