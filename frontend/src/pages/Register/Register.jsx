import useAuth from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import AuthCard from '../../components/ui/AuthCard/AuthCard';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import { ROLES } from '../../utils/constants';
import './Register.css';

const SCHEMA = {
  name: { required: true },
  email: { required: true, email: true },
  password: { required: true, minLength: 6 },
};

const roleLabels = {
  [ROLES.PATIENT]: '🙋 Patient',
  [ROLES.DOCTOR]: '👨‍⚕️ Doctor',
  [ROLES.ADMIN]: '🛡️ Admin',
};

export default function Register() {
  const { handleRegister, submitting, error } = useAuth();
  const { form, validate, fieldProps, onChange } = useForm({ name: '', email: '', password: '', role: ROLES.PATIENT }, SCHEMA);

  const onSubmit = (e) => {
    e.preventDefault();
    if (validate()) handleRegister(form);
  };

  return (
    <AuthCard
      subtitle="Create your account"
      onSubmit={onSubmit}
      error={error}
      footer={{ text: 'Already have an account?', to: '/login', linkLabel: 'Sign in' }}
    >
      <Input label="Full Name" placeholder="John Doe" disabled={submitting} {...fieldProps('name')} />
      <Input label="Email" type="email" placeholder="you@example.com" disabled={submitting} {...fieldProps('email')} />
      <Input label="Password" type="password" placeholder="Min. 6 characters" disabled={submitting} {...fieldProps('password')} />

      <div className="role-selector">
        <span className="input-label">Role</span>
        <div className="role-options">
          {Object.entries(roleLabels).map(([value, label]) => (
            <label key={value} className={`role-option ${form.role === value ? 'role-option-active' : ''}`}>
              <input type="radio" name="role" value={value} checked={form.role === value} onChange={onChange} disabled={submitting} />
              {label}
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" fullWidth disabled={submitting} size="lg">
        {submitting ? 'Creating account...' : 'Create Account'}
      </Button>
    </AuthCard>
  );
}
