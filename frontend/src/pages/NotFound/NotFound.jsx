import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
      <h1 style={{ fontSize: '5rem', margin: 0 }}>404</h1>
      <p style={{ color: '#6b7280' }}>Page not found</p>
      <Link to="/dashboard" style={{ color: '#2563eb' }}>Back to Dashboard</Link>
    </div>
  );
}
