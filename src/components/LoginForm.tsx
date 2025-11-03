import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, respondToMfaChallenge } from '../services/cognitoAuth';
import { validateEmail } from '../utils/validation';
import { ErrorMessage } from './ErrorMessage';
import { GoogleSignInButton } from './GoogleSignInButton';
import { MFAInput } from './MFAInput';

export const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [requiresMFA, setRequiresMFA] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});
    
    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });

      if (result.requiresMFA) {
        setRequiresMFA(true);
        setUserEmail(formData.email);
      } else if (result.accessToken) {
        localStorage.setItem('cognitoToken', result.idToken);
        navigate('/success');
      }
    } catch (err: any) {
      setErrors({ submit: err.message || 'Invalid email or password' });
    } finally {
      setLoading(false);
    }
  };

  const handleMfaSubmit = async (code: string) => {
    try {
      const result = await respondToMfaChallenge(code);
      if (result.accessToken) {
        localStorage.setItem('cognitoToken', result.idToken);
        navigate('/success');
      }
    } catch (err: any) {
      throw err;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  if (requiresMFA) {
    return (
      <MFAInput
        onSubmit={handleMfaSubmit}
        email={userEmail}
        error={errors.submit}
      />
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md border border-gray-200">
      <div className="px-8 py-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 text-center">Welcome Back</h1>
        <p className="text-gray-600 text-center mt-1 text-sm">Sign in to your account</p>
      </div>

      <div className="p-8">
        <GoogleSignInButton disabled={loading} />
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="you@example.com"
              required
            />
            <ErrorMessage message={errors.email || ''} />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              placeholder="Enter your password"
              required
            />
            <ErrorMessage message={errors.password || ''} />
          </div>

          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          <ErrorMessage message={errors.submit || ''} className="mt-2" />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
