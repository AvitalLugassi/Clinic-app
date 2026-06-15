import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from '../../hooks/useForm';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import { doctorPreActivate, doctorCompleteActivate } from '../../services/auth.service';
import '../Register/Register.css';

export default function DoctorActivate() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const step1Form = useForm({ email: '' }, { email: { required: true, staffEmail: true } });
  const step2Form = useForm({ otp: '', password: '' }, { otp: { required: true }, password: { required: true, minLength: 6 } });

  const handleStep1 = async (e) => {
    e.preventDefault();
    if (!step1Form.validate()) return;
    setError('');
    setSubmitting(true);
    try {
      await doctorPreActivate({ email: step1Form.form.email });
      setEmail(step1Form.form.email);
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
      await doctorCompleteActivate({ email, otp: step2Form.form.otp, password: step2Form.form.password });
      setSuccess('החשבון הופעל בהצלחה! מועבר/ת להתחברות...');
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
          <div className="auth-logo">👨⚕️</div>
          <h1 className="auth-title">הפעלת חשבון רופא</h1>
        </div>

        {step === 1 && (
          <form className="auth-form" onSubmit={handleStep1}>
            {error && <p className="auth-error">{error}</p>}
            <p className="auth-subtitle">הזן את כתובת המייל של המרפאה שקיבלת</p>
            <Input label="אימייל מרפאה" type="email" placeholder="doctor@clinic-app.com" disabled={submitting} {...step1Form.fieldProps('email')} />
            <Button type="submit" fullWidth disabled={submitting} size="lg">
              {submitting ? 'שולח...' : 'שלח קוד אימות'}
            </Button>
          </form>
        )}

        {step === 2 && (
          <form className="auth-form" onSubmit={handleStep2}>
            {error && <p className="auth-error">{error}</p>}
            {success && <p className="auth-success">{success}</p>}
            <p className="auth-subtitle">נשלח קוד חד-פעמי לכתובת <strong>{email}</strong></p>
            <Input label="קוד אימות" type="text" placeholder="123456" disabled={submitting} {...step2Form.fieldProps('otp')} />
            <Input label="סיסמה חדשה" type="password" placeholder="לפחות 6 תווים" disabled={submitting} {...step2Form.fieldProps('password')} />
            <Button type="submit" fullWidth disabled={submitting} size="lg">
              {submitting ? 'שומר...' : 'הפעל חשבון'}
            </Button>
            <button type="button" className="register-back" onClick={() => { setStep(1); setError(''); }}>
              חזרה
            </button>
          </form>
        )}

        <p className="auth-footer">כבר הפעלת? <Link to="/login">כניסה</Link></p>
      </div>
    </div>
  );
}
