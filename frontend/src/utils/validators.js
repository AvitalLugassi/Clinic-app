export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isValidPassword = (password) => password?.length >= 6;
export const isRequired = (value) => value !== undefined && value !== null && String(value).trim() !== '';

export function validateForm(values, schema) {
  const errors = {};
  for (const field in schema) {
    const rules = schema[field];
    const value = values[field];
    if (rules.required && !isRequired(value)) {
      errors[field] = `${field} is required`;
    } else if (rules.email && value && !isValidEmail(value)) {
      errors[field] = 'Invalid email address';
    } else if (rules.minLength && value && value.length < rules.minLength) {
      errors[field] = `Must be at least ${rules.minLength} characters`;
    }
  }
  return errors;
}

