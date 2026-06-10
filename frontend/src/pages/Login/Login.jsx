import { useState } from 'react';
import useAuth from '../../hooks/useAuth';

export default function Login() {
  const { handleLogin, submitting, error } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const onSubmit = (e) => { e.preventDefault(); handleLogin(form); };

  return (
    <form onSubmit={onSubmit}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input name="email" value={form.email} onChange={onChange} placeholder="Email" />
      <input name="password" type="password" value={form.password} onChange={onChange} placeholder="Password" />
      <button type="submit" disabled={submitting}>
        {submitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
