import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">🏥 ClinicApp</Link>
      <div className="navbar-user">
        <span className="navbar-username">{user?.name}</span>
        <span className="navbar-role">{user?.role}</span>
        <button className="navbar-logout" onClick={onLogout}>Logout</button>
      </div>
    </nav>
  );
}
