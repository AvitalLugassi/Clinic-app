import { useState } from 'react';

export default function useAsyncAction() {
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const execute = async (fn) => {
    setError(null);
    setSubmitting(true);
    try {
      return await fn();
    } catch (err) {
      setError(err.response?.data?.message ?? 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return { error, submitting, execute };
}
