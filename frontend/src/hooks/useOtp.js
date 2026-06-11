import { useState } from 'react';
import api from '../services/api';

export default function useOtp(purpose) {
  const [step, setStep] = useState('idle'); // idle | sent | verified
  const [otpToken, setOtpToken] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');

  const requestOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/otp/request', { purpose });
      setMaskedEmail(data.email);
      setStep('sent');
    } catch (e) {
      setError(e.response?.data?.message || 'שגיאה בשליחת קוד');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (code) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/auth/otp/verify', { code, purpose });
      setOtpToken(data.otpToken);
      setStep('verified');
      return data.otpToken;
    } catch (e) {
      setError(e.response?.data?.message || 'קוד שגוי');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => { setStep('idle'); setOtpToken(null); setError(null); };

  return { step, otpToken, maskedEmail, error, loading, requestOtp, verifyOtp, reset };
}
