interface ErrorMessageProps {
  message: string;
  className?: string;
}

export const ErrorMessage = ({ message, className = '' }: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <div className={`text-red-600 text-sm mt-1 ${className}`} role="alert">
      {message}
    </div>
  );
};
