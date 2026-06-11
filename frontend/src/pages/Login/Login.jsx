import useAuth from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';
import AuthCard from '../../components/ui/AuthCard/AuthCard';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';

const SCHEMA = {
  email: { required: true, email: true },
  password: { required: true },
};

export default function Login() {
  const { handleLogin, submitting, error } = useAuth();
  const { form, validate, fieldProps } = useForm({ email: '', password: '' }, SCHEMA);

  const onSubmit = (e) => {
    e.preventDefault();
    if (validate()) handleLogin(form);
  };

  return (
    <AuthCard
      subtitle="Sign in to your account"
      onSubmit={onSubmit}
      error={error}
      footer={{ text: "Don't have an account?", to: '/register', linkLabel: 'Register' }}
    >
      <Input label="Email" type="email" placeholder="you@example.com" disabled={submitting} {...fieldProps('email')} />
      <Input label="Password" type="password" placeholder="••••••••" disabled={submitting} {...fieldProps('password')} />
      <Button type="submit" fullWidth disabled={submitting} size="lg">
        {submitting ? 'Signing in...' : 'Sign In'}
      </Button>
    </AuthCard>
  );
}
