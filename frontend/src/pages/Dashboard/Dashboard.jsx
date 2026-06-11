import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import AdminDashboard from '../AdminDashboard/AdminDashboard';
import DoctorDashboard from '../DoctorDashboard/DoctorDashboard';
import PatientDashboard from '../PatientDashboard/PatientDashboard';

const dashboardByRole = {
  admin: <AdminDashboard />,
  doctor: <DoctorDashboard />,
  patient: <PatientDashboard />,
};

export default function Dashboard() {
  const { user } = useAuthContext();
  return dashboardByRole[user?.role] ?? <Navigate to="/login" replace />;
}
