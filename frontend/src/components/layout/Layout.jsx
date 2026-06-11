import { Outlet } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './Layout.css';

export default function Layout() {
  const { user, logout } = useAuthContext();
  return (
    <div className="layout">
      <Navbar user={user} onLogout={logout} />
      <Sidebar role={user?.role} />
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}
