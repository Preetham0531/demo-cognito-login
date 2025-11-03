import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword, confirmForgotPassword, loginAfterPasswordReset } from '../services/cognitoAuth';
import { validateEmail, validatePassword } from '../utils/validation';
import { ErrorMessage } from './ErrorMessage';
import { LoadingSpinner } from './LoadingSpinner';

type Step = 'email' | 'code' | 'success';

export const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      setStep('code');
    } catch (err: any) {
      setErrors({ submit: err.message || 'Failed to send reset code' });
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!code || code.length !== 6) {
      setErrors({ code: 'Please enter a valid 6-digit code' });
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setErrors({ password: passwordValidation.errors[0] });
      return;
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    try {
      await confirmForgotPassword(email, code, password);
      await loginAfterPasswordReset(email, password);
      localStorage.setItem('cognitoToken', 'reset-token');
      setStep('success');
      setTimeout(() => {
        navigate('/success');
      }, 2000);
    } catch (err: any) {
      setErrors({ submit: err.message || 'Failed to reset password' });
    } finally {
      setLoading(false);
    }
  };

  if (step === 'email') {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white text-center">Reset Password</h1>
          <p className="text-cyan-100 text-center mt-1 text-sm">Enter your email to receive a reset code</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <ErrorMessage message={errors.email || ''} />
            </div>

            <ErrorMessage message={errors.submit || ''} />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Sending Code...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Code</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'code') {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white text-center">Verify & Reset</h1>
          <p className="text-cyan-100 text-center mt-1 text-sm">Enter code and new password</p>
        </div>

        <div className="p-8">
          <p className="text-gray-600 mb-6 text-center">
            Code sent to <span className="font-semibold text-gray-900">{email}</span>
          </p>

          <form onSubmit={handleCodeSubmit} className="space-y-5">
            <div>
              <label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2 text-center">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-center text-3xl tracking-[0.5em] font-mono font-bold transition-all outline-none"
                placeholder="000000"
                required
              />
              <ErrorMessage message={errors.code || ''} />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none"
                  placeholder="Create new password"
                  required
                />
              </div>
              <ErrorMessage message={errors.password || ''} />
              <p className="text-xs text-gray-500 mt-2 ml-1">
                Must be at least 8 characters with uppercase, lowercase, number, and special character
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all outline-none"
                  placeholder="Re-enter new password"
                  required
                />
              </div>
              <ErrorMessage message={errors.confirmPassword || ''} />
            </div>

            <ErrorMessage message={errors.submit || ''} />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Resetting Password...</span>
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setStep('email')}
            className="mt-5 w-full text-sm font-medium text-cyan-600 hover:text-cyan-700 transition-colors"
          >
            ← Back to email entry
          </button>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
          <h2 className="text-2xl font-bold text-white text-center">Password Reset!</h2>
        </div>
        <div className="p-8 text-center">
          <div className="mb-4 flex justify-center">
            <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-2">Your password has been successfully reset.</p>
          <p className="text-sm text-gray-500">Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return null;
};
