export const ConfigError = () => {
  const missingVars: string[] = [];
  
  if (!import.meta.env.VITE_COGNITO_USER_POOL_ID) {
    missingVars.push('VITE_COGNITO_USER_POOL_ID');
  }
  if (!import.meta.env.VITE_COGNITO_APP_CLIENT_ID) {
    missingVars.push('VITE_COGNITO_APP_CLIENT_ID');
  }

  if (missingVars.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Configuration Error</h1>
          <p className="text-gray-600 mb-4">
            The following environment variables are missing in AWS Amplify:
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <ul className="text-left list-disc list-inside space-y-2 text-red-700">
              {missingVars.map((varName) => (
                <li key={varName} className="font-mono text-sm">{varName}</li>
              ))}
            </ul>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
            <p className="text-sm text-blue-800 font-semibold mb-2">How to fix:</p>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Go to AWS Amplify Console</li>
              <li>Select your app</li>
              <li>Go to "App settings" → "Environment variables"</li>
              <li>Add the missing variables above</li>
              <li>Save and wait for auto-redeploy</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
