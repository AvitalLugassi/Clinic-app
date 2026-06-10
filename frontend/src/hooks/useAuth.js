import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import useAsyncAction from './useAsyncAction';

export default function useAuth() {
  const { login, logout, user, loading } = useAuthContext();
  const { error, submitting, execute } = useAsyncAction();
  const navigate = useNavigate();

  const handleLogin = (credentials) => execute(async () => {
    const loggedUser = await login(credentials);
    const routes = { admin: '/admin', doctor: '/doctor', patient: '/patient' };
    navigate(routes[loggedUser.role] ?? '/');
  });

  return { user, loading, submitting, error, handleLogin, logout };
}