import { useState } from 'react';
import { validateForm } from '../utils/validators';

export function useForm(initialValues, schema) {
  const [form, setForm] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState({});

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (fieldErrors[name]) setFieldErrors((p) => ({ ...p, [name]: null }));
  };

  const validate = () => {
    const errors = validateForm(form, schema);
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fieldProps = (name) => ({ name, value: form[name], onChange, error: fieldErrors[name] });

  return { form, validate, fieldProps, onChange };
}
