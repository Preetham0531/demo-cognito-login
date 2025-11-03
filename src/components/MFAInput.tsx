import { useState } from 'react';
import { ErrorMessage } from './ErrorMessage';

interface MFAInputProps {
  onSubmit: (code: string) => Promise<void>;
  email: string;
  error?: string;
}

export const MFAInput = ({ onSubmit, email, error }: MFAInputProps) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    
    if (!code || code.length !== 6) {
      setLocalError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(code);
    } catch (err: any) {
      setLocalError(err.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md border border-gray-200">
      <div className="px-8 py-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 text-center">Two-Factor Authentication</h1>
        <p className="text-gray-600 text-center mt-1 text-sm">Enter the code sent to your device</p>
      </div>

      <div className="p-8">
        <p className="text-gray-600 mb-6 text-center">
          We've sent a verification code to <span className="font-semibold text-gray-900">{email}</span>
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="mfa-code" className="block text-sm font-semibold text-gray-700 mb-2 text-center">
              Verification Code
            </label>
            <input
              id="mfa-code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-center text-2xl tracking-widest font-mono outline-none"
              placeholder="000000"
              disabled={loading}
              autoFocus
              required
            />
            <ErrorMessage message={localError || error || ''} className="mt-2" />
          </div>

          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full bg-amber-600 text-white py-2 px-4 rounded-md font-medium hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
      </div>
    </div>
  );
};
