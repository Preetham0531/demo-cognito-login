import { SignUpForm } from '../components/SignUpForm';

export const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-md">
        <SignUpForm />
      </div>
    </div>
  );
};
