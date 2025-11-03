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
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-red-500 to-orange-600 px-8 py-6">
          <div className="flex items-center justify-center mb-2">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white text-center">Configuration Required</h1>
        </div>
        
        <div className="p-8">
          <p className="text-gray-700 mb-6 text-center text-lg">
            The following environment variables are missing in AWS Amplify:
          </p>
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 mb-6">
            <ul className="space-y-2">
              {missingVars.map((varName) => (
                <li key={varName} className="font-mono text-sm text-red-800 bg-white px-3 py-2 rounded-lg border border-red-200">
                  {varName}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
            <p className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How to fix:
            </p>
            <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
              <li>Go to AWS Amplify Console</li>
              <li>Select your app</li>
              <li>Navigate to "App settings" → "Environment variables"</li>
              <li>Add each missing variable listed above</li>
              <li>Save and wait for automatic redeployment</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
