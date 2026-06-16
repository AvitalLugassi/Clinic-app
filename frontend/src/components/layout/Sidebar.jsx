import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import './Sidebar.css';

const getLinks = (uuid) => ({
  admin: [

    { to: `/${uuid}/dashboard`, label: '📊 Dashboard' },
    { to: `/${uuid}/reports`,   label: '📈 Reports' },
  ],
  doctor: [
    { to: `/${uuid}/dashboard`,    label: '📊 Dashboard' },
    { to: `/${uuid}/appointments`, label: '📅 Appointments' },
    { to: `/${uuid}/records`,      label: '📋 Medical Records' },
  ],
  patient: [
    { to: `/${uuid}/dashboard`,     label: '📊 Dashboard' },
    { to: `/${uuid}/appointments`,  label: '📅 Book Appointment' },
    { to: `/${uuid}/records`,       label: '📋 My Records' },
    { to: `/${uuid}/prescriptions`, label: '💊 My Prescriptions' },
    { to: `/${uuid}/profile`,       label: '👤 Profile' },
  ],
});

export default function Sidebar({ role }) {
  const { user } = useAuthContext();
  const navLinks = getLinks(user?.user_uuid)[role] || [];

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
