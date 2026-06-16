import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import './Navbar.css';

export default function Navbar({ user, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const initial = user?.name?.charAt(0)?.toUpperCase() || '?';
  const avatarId = user?.id || 1;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      const wrapper = document.querySelector('.user-profile-wrapper');
      if (wrapper && !wrapper.contains(e.target)) setShowDropdown(false);
    };
    if (showDropdown) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="brand-logo">
          <Link to="/" className="brand-name">🏥 ClinicApp</Link>
        </div>
        <div className="welcome-banner__text">
        <h1 className="welcome-banner__sub">Welcome, {user?.role === 'doctor' ? `Dr. ${user.full_name}` : (user?.full_name ?? 'מטופל')} 👋</h1>
          <span className="welcome-banner__date">{today}</span>
        </div>
        <div className="header-right">
          <div className="notification-wrapper">
            <button className="notification-btn">
              {/* // צריך לעשות את זה מסונכרן עם מונגו שאם יש לו הודעות אז זה יופיע כאן עם מספר נכון של הודעות  */}
              <span>🔔</span>
              <span className="badge">3</span>
            </button>
          </div>

          <div className="messages-wrapper">
            <button className="messages-btn">
              <span>💬</span>
              <span className="badge">2</span>
            </button>
          </div>

          <div className="user-profile-wrapper">
            <button className="user-profile-btn" onClick={() => setShowDropdown(!showDropdown)}>
              <div className="user-avatar-container">
                <img
                  src={`https://i.pravatar.cc/150?img=${avatarId}`}
                  alt="Profile"
                  className="user-avatar-img"
                  onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                />
                <div className="user-avatar-fallback" style={{ display: 'none' }}>{initial}</div>
                <span className="user-status-dot"></span>
              </div>
              <div className="user-info">
                <span className="user-display-name">{user?.name}</span>
                <span className="user-status-text">Online</span>
              </div>
              <span className="dropdown-arrow">▼</span>
            </button>

            {showDropdown && (
              <div className="user-dropdown-menu">
                <div className="dropdown-header">
                  <img src={`https://i.pravatar.cc/150?img=${avatarId}`} alt="Profile" className="dropdown-avatar" />
                  <div className="dropdown-user-info">
                    <div className="dropdown-name">{user?.name}</div>
                    <div className="dropdown-email">{user?.email}</div>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <Link to={user?.user_uuid ? `/${user.user_uuid}/profile` : '/profile'} className="dropdown-item" onClick={() => setShowDropdown(false)}>
                  <span>👤</span><span>My Profile</span>
                </Link>
                <Link to="/terms" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                  <span>📄</span><span>Terms of Service</span>
                </Link>
                <button className="dropdown-item logout-item" onClick={() => { onLogout(); setShowDropdown(false); }}>
                  <span>⏻</span><span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
