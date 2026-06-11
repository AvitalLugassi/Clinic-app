export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isStaffEmail = (email) => isValidEmail(email) && email.endsWith('@clinic-app.com');
export const isValidIdNumber = (id) => {
  const str = String(id).padStart(9, '0');
  if (str.length !== 9) return false;
  return Array.from(str).reduce((acc, digit, i) => {
    let num = parseInt(digit) * ((i % 2) + 1);
    return acc + (num > 9 ? num - 9 : num);
  }, 0) % 10 === 0;
};
export const isValidPassword = (password) => password?.length >= 6;
export const isRequired = (value) => value !== undefined && value !== null && String(value).trim() !== '';

export function validateForm(values, schema) {
  const errors = {};
  for (const field in schema) {
    const rules = schema[field];
    const value = values[field];
    if (rules.required && !isRequired(value)) {
      errors[field] = `${field} is required`;
    } else if (rules.staffEmail && value && !isStaffEmail(value)) {
      errors[field] = 'מייל חייב להסתיים ב-@clinic-app.com';
    } else if (rules.email && value && !isValidEmail(value)) {
      errors[field] = 'Invalid email address';
    } else if (rules.idNumber && value && !isValidIdNumber(value)) {
      errors[field] = 'מספר זהות לא תקין';
    } else if (rules.minLength && value && value.length < rules.minLength) {
      errors[field] = `Must be at least ${rules.minLength} characters`;
    }
  }
  return errors;
}

