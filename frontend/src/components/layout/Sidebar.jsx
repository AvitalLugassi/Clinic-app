import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const links = {
  admin: [
    { to: '/dashboard', label: '📊 Dashboard' },
    { to: '/patients', label: '🧑‍⚕️ Patients' },
    { to: '/doctors', label: '👨‍⚕️ Doctors' },
    { to: '/appointments', label: '📅 Appointments' },
    { to: '/reports', label: '📈 Reports' },
  ],
  doctor: [
    { to: '/dashboard', label: '📊 Dashboard' },
    { to: '/appointments', label: '📅 Appointments' },
    { to: '/patients', label: '🧑‍⚕️ My Patients' },
    { to: '/records', label: '📋 Medical Records' },
    { to: '/prescriptions', label: '💊 Prescriptions' },
  ],
  patient: [
    { to: '/dashboard', label: '📊 Dashboard' },
    { to: '/appointments', label: '📅 Book Appointment' },
    { to: '/records', label: '📋 My Records' },
    { to: '/prescriptions', label: '💊 My Prescriptions' },
    { to: '/profile', label: '👤 Profile' },
  ],
};

export default function Sidebar({ role }) {
  const navLinks = links[role] || [];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
