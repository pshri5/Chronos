// Email validation utility shared across auth forms.
// RFC-style pragmatic regex: local@domain.tld, no whitespace, max 254 chars.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): { valid: boolean; error: string | null } => {
  const value = email.trim();
  if (!value) {
    return { valid: false, error: 'Email is required' };
  }
  if (value.length > 254) {
    return { valid: false, error: 'Email is too long' };
  }
  if (!EMAIL_REGEX.test(value)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  return { valid: true, error: null };
};
