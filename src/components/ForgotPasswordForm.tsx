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
      <div className="w-full bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-8 py-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 text-center">Reset Password</h1>
          <p className="text-gray-600 text-center mt-1 text-sm">Enter your email to receive a reset code</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                placeholder="you@example.com"
                required
              />
              <ErrorMessage message={errors.email || ''} />
            </div>

            <ErrorMessage message={errors.submit || ''} />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 text-white py-2 px-4 rounded-md font-medium hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Sending Code...' : 'Send Reset Code'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === 'code') {
    return (
      <div className="w-full bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-8 py-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 text-center">Verify & Reset</h1>
          <p className="text-gray-600 text-center mt-1 text-sm">Enter code and new password</p>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-center text-xl tracking-widest font-mono outline-none"
                placeholder="000000"
                required
              />
              <ErrorMessage message={errors.code || ''} />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                placeholder="Create new password"
                required
              />
              <ErrorMessage message={errors.password || ''} />
              <p className="text-xs text-gray-500 mt-2 ml-1">
                Must be at least 8 characters with uppercase, lowercase, number, and special character
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
                placeholder="Re-enter new password"
                required
              />
              <ErrorMessage message={errors.confirmPassword || ''} />
            </div>

            <ErrorMessage message={errors.submit || ''} />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-600 text-white py-2 px-4 rounded-md font-medium hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
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
      <div className="w-full bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-8 py-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 text-center">Password Reset!</h2>
        </div>
        <div className="p-8 text-center">
          <p className="text-gray-600 mb-2">Your password has been successfully reset.</p>
          <p className="text-sm text-gray-500">Redirecting you to login...</p>
        </div>
      </div>
    );
  }

  return null;
};
