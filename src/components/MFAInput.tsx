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
    <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-8 py-6">
        <div className="flex items-center justify-center mb-2">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-white text-center">Two-Factor Authentication</h1>
        <p className="text-amber-100 text-center mt-2 text-sm">Enter the code sent to your device</p>
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
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-center text-3xl tracking-[0.5em] font-mono font-bold transition-all outline-none"
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
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify Code</span>
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
};
