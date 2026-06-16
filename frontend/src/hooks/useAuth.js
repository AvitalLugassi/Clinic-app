import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import useAsyncAction from './useAsyncAction';

const ROLE_ROUTES = { patient: 'dashboard', doctor: 'dashboard', admin: 'dashboard' };

export default function useAuth() {
  const { loginPatient, loginStaff, logout, user, loading } = useAuthContext();
  const { error, submitting, execute } = useAsyncAction();
  const navigate = useNavigate();

  const redirect = (u) => navigate(`/${u.user_uuid}/${ROLE_ROUTES[u.role] ?? 'dashboard'}`);

  const handlePatientLogin = (credentials) => execute(async () => redirect(await loginPatient(credentials)));
  const handleStaffLogin  = (credentials) => execute(async () => redirect(await loginStaff(credentials)));

  return { user, loading, submitting, error, handlePatientLogin, handleStaffLogin, logout };
}