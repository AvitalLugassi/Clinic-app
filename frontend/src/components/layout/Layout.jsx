import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './Layout.css';

export default function Layout({ user, onLogout }) {
  return (
    <div className="layout">
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar role={user?.role} />
      <main className="layout-main">
        <Outlet />
      </main>
    </div>
  );
}
