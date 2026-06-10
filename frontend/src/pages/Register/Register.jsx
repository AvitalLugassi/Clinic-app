import { useState } from 'react';
import useRegister from '../../hooks/useRegister';

export default function Register() {
  const { handleRegister, submitting, error } = useRegister();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient' });

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const onSubmit = (e) => { e.preventDefault(); handleRegister(form); };

  return (
    <form onSubmit={onSubmit}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input name="name" value={form.name} onChange={onChange} placeholder="Full Name" />
      <input name="email" value={form.email} onChange={onChange} placeholder="Email" />
      <input name="password" type="password" value={form.password} onChange={onChange} placeholder="Password" />
      <select name="role" value={form.role} onChange={onChange}>
        <option value="patient">Patient</option>
        <option value="doctor">Doctor</option>
      </select>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
