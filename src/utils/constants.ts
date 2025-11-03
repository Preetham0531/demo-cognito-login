export const ERROR_MESSAGES: Record<string, string> = {
  'UserNotFoundException': 'User does not exist',
  'NotAuthorizedException': 'Incorrect username or password',
  'UserNotConfirmedException': 'User is not confirmed. Please check your email for verification code',
  'PasswordResetRequiredException': 'Password reset required',
  'UserLambdaValidationException': 'Invalid input data',
  'InvalidParameterException': 'Invalid parameters provided',
  'InvalidPasswordException': 'Password does not meet requirements',
  'UsernameExistsException': 'An account with this email already exists',
  'CodeMismatchException': 'Invalid verification code',
  'ExpiredCodeException': 'Verification code has expired. Please request a new one',
  'LimitExceededException': 'Attempt limit exceeded, please try again later',
  'TooManyFailedAttemptsException': 'Too many failed attempts. Please try again later',
  'NetworkError': 'Network error. Please check your connection',
  'UnknownError': 'An unexpected error occurred',
};

export const getErrorMessage = (error: any): string => {
  if (error?.code) {
    return ERROR_MESSAGES[error.code] || error.message || ERROR_MESSAGES['UnknownError'];
  }
  if (error?.message) {
    return error.message;
  }
  return ERROR_MESSAGES['UnknownError'];
};
