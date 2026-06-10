import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuthContext } from './context/AuthContext';
import Layout from './components/layout/Layout';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard/PatientDashboard';
import AppointmentCalendar from './pages/AppointmentCalendar/AppointmentCalendar';
import BookAppointment from './pages/BookAppointment/BookAppointment';
import MedicalRecord from './pages/MedicalRecord/MedicalRecord';
import PatientProfile from './pages/PatientProfile/PatientProfile';
import Reports from './pages/Reports/Reports';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import NotFound from './pages/NotFound/NotFound';

const dashboardByRole = {
  admin: <AdminDashboard />,
  doctor: <DoctorDashboard />,
  patient: <PatientDashboard />,
};

function AppRoutes() {
  const { user, logout } = useAuthContext();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Layout user={user} onLogout={logout} />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={dashboardByRole[user?.role] ?? <Navigate to="/login" />} />
        <Route path="/appointments" element={<AppointmentCalendar />} />
        <Route path="/appointments/book" element={<BookAppointment />} />
        <Route path="/records" element={<MedicalRecord />} />
        <Route path="/profile" element={<PatientProfile />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
