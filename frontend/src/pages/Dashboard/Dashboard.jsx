import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import DoctorDashboard from './DoctorDashboard';
import PatientDashboard from './PatientDashboard';

const dashboardByRole = {
  admin: <AdminDashboard />,
  doctor: <DoctorDashboard />,
  patient: <PatientDashboard />,
};

export default function Dashboard() {
  const { user } = useAuthContext();
  return dashboardByRole[user?.role] ?? <Navigate to="/login" replace />;
}
