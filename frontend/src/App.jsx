import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import AppointmentCalendar from './pages/AppointmentCalendar/AppointmentCalendar';
import MedicalRecord from './pages/MedicalRecord/MedicalRecord';
import PatientProfile from './pages/PatientProfile/PatientProfile';
import Reports from './pages/Reports/Reports';
import NotFound from './pages/NotFound/NotFound';
import DoctorActivate from './pages/DoctorActivate/DoctorActivate';
import MyPrescriptions from './pages/MyPrescriptions/MyPrescriptions';

const ROLE_ROUTES = [
  { path: 'dashboard',          element: <Dashboard />,          roles: ['patient', 'doctor', 'admin'] },
  { path: 'appointments', element: <AppointmentCalendar />, roles: ['patient', 'doctor'] },
  { path: 'records',            element: <MedicalRecord />,       roles: ['patient', 'doctor'] },
  { path: 'profile',            element: <PatientProfile />,      roles: ['patient'] },
  { path: 'prescriptions',      element: <MyPrescriptions />,     roles: ['patient'] },
  { path: 'reports',            element: <Reports />,             roles: ['admin'] },
];

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/doctor-activate" element={<DoctorActivate />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          {ROLE_ROUTES.map(({ path, element, roles }) => (
            <Route key={path} path={`/${path}`} element={
              <ProtectedRoute roles={roles}>{element}</ProtectedRoute>
            } />
          ))}
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
