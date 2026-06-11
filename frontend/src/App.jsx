import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import AppointmentCalendar from './pages/AppointmentCalendar/AppointmentCalendar';
import BookAppointment from './pages/BookAppointment/BookAppointment';
import MedicalRecord from './pages/MedicalRecord/MedicalRecord';
import PatientProfile from './pages/PatientProfile/PatientProfile';
import Reports from './pages/Reports/Reports';
import NotFound from './pages/NotFound/NotFound';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/appointments" element={
            <ProtectedRoute roles={['admin', 'doctor', 'patient']}><AppointmentCalendar /></ProtectedRoute>
          } />
          <Route path="/appointments/book" element={
            <ProtectedRoute roles={['patient']}><BookAppointment /></ProtectedRoute>
          } />
          <Route path="/records" element={
            <ProtectedRoute roles={['admin', 'doctor', 'patient']}><MedicalRecord /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute roles={['patient']}><PatientProfile /></ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute roles={['admin']}><Reports /></ProtectedRoute>
          } />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
