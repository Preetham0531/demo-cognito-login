import { useState } from 'react';
import { ErrorMessage } from './ErrorMessage';
import { LoadingSpinner } from './LoadingSpinner';

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
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Verification Code</h2>
      <p className="text-gray-600 mb-6">
        We've sent a verification code to {email}
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="mfa-code" className="block text-sm font-medium text-gray-700 mb-1">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-2xl tracking-widest"
            placeholder="000000"
            disabled={loading}
            autoFocus
            required
          />
          <ErrorMessage message={localError || error || ''} />
        </div>

        <button
          type="submit"
          disabled={loading || code.length !== 6}
          className="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <LoadingSpinner size="sm" />
              Verifying...
            </>
          ) : (
            'Verify Code'
          )}
        </button>
      </form>
    </div>
  );
};
