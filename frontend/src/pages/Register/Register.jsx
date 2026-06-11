import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import { patientPreRegister, patientCompleteRegister } from '../../services/auth.service';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: ת"ז, 2: OTP + סיסמה
  const [maskedEmail, setMaskedEmail] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const step1Form = useForm({ id_number: '' }, { id_number: { required: true, idNumber: true } });
  const step2Form = useForm({ otp: '', password: '' }, { otp: { required: true }, password: { required: true, minLength: 6 } });

  const handleStep1 = async (e) => {
    e.preventDefault();
    if (!step1Form.validate()) return;
    setError('');
    setSubmitting(true);
    try {
      const res = await patientPreRegister({ id_number: step1Form.form.id_number });
      setIdNumber(step1Form.form.id_number);
      setMaskedEmail(res.data.email);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה, נסה שוב');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    if (!step2Form.validate()) return;
    setError('');
    setSubmitting(true);
    try {
      await patientCompleteRegister({ id_number: idNumber, otp: step2Form.form.otp, password: step2Form.form.password });
      setSuccess('נרשמת בהצלחה! מועבר/ת להתחברות...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה, נסה שוב');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🏥</div>
          <h1 className="auth-title">הרשמה לאפליקציה</h1>
        </div>

        {step === 1 && (
          <form className="auth-form" onSubmit={handleStep1}>
            {error && <p className="auth-error">{error}</p>}
            <p className="auth-subtitle">הזן את תעודת הזהות שלך לאימות</p>
            <Input label="מספר זהות" type="text" placeholder="123456789" disabled={submitting} {...step1Form.fieldProps('id_number')} />
            <Button type="submit" fullWidth disabled={submitting} size="lg">
              {submitting ? 'בודק...' : 'המשך'}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form className="auth-form" onSubmit={handleStep2}>
            {error && <p className="auth-error">{error}</p>}
            {success && <p className="auth-success">{success}</p>}
            <p className="auth-subtitle">נשלח קוד חד-פעמי לכתובת <strong>{maskedEmail}</strong></p>
            <Input label="קוד אימות" type="text" placeholder="123456" disabled={submitting} {...step2Form.fieldProps('otp')} />
            <Input label="סיסמה חדשה" type="password" placeholder="לפחות 6 תווים" disabled={submitting} {...step2Form.fieldProps('password')} />
            <Button type="submit" fullWidth disabled={submitting} size="lg">
              {submitting ? 'שומר...' : 'השלם הרשמה'}
            </Button>
            <button type="button" className="register-back" onClick={() => { setStep(1); setError(''); }}>
              חזרה
            </button>
          </form>
        )}

        <p className="auth-footer">יש לך חשבון? <Link to="/login">כניסה</Link></p>
      </div>
    </div>
  );
}
