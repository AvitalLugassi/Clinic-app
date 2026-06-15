import { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import './Login.css';

const TABS = {
  patient: {
    label: '🙋 מטופל',
    fields: [
      { name: 'id_number', label: 'מספר זהות', type: 'text', placeholder: '123456789', rules: { required: true } },
    ],
  },
  staff: {
    label: '👨‍⚕️ צוות רפואי',
    fields: [
      { name: 'email', label: 'אימייל מרפאה', type: 'email', placeholder: 'doctor@clinic-app.com', rules: { required: true, staffEmail: true } },
    ],
  },
};

export default function Login() {
  const [tab, setTab] = useState('patient');
  const { handlePatientLogin, handleStaffLogin, submitting, error } = useAuth();

  const { fields } = TABS[tab];
  const schema = Object.fromEntries(fields.map(f => [f.name, f.rules]));

  const getInitial = (t) => Object.fromEntries([...TABS[t].fields.map(f => [f.name, '']), ['password', '']]);

  const { form, validate, fieldProps, resetForm } = useForm(getInitial(tab), { ...schema, password: { required: true } });

  const handleTabChange = (t) => { setTab(t); resetForm(getInitial(t)); };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    tab === 'patient' ? handlePatientLogin(form) : handleStaffLogin(form);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🏥</div>
          <h1 className="auth-title">Clinic App</h1>
        </div>

        <div className="login-tabs">
          {Object.entries(TABS).map(([key, { label }]) => (
            <button key={key} className={`login-tab ${tab === key ? 'login-tab-active' : ''}`} onClick={() => handleTabChange(key)}>
              {label}
            </button>
          ))}
        </div>

        <form className="auth-form" onSubmit={onSubmit}>
          {error && <p className="auth-error">{error}</p>}
          {fields.map(({ name, label, type, placeholder }) => (
            <Input key={name} label={label} type={type} placeholder={placeholder} disabled={submitting} {...fieldProps(name)} />
          ))}
          <Input label="סיסמה" type="password" placeholder="••••••••" disabled={submitting} {...fieldProps('password')} />
          <Button type="submit" fullWidth disabled={submitting} size="lg">
            {submitting ? 'מתחבר...' : 'כניסה'}
          </Button>
        </form>

        {tab === 'patient' && (
          <p className="auth-footer">אין לך חשבון? <Link to="/register">הרשמה</Link></p>
        )}
      </div>
    </div>
  );
}
