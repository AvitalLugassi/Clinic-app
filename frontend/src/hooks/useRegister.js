import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth.service';
import useAsyncAction from './useAsyncAction';

export default function useRegister() {
  const { error, submitting, execute } = useAsyncAction();
  const navigate = useNavigate();

  const handleRegister = (userData) => execute(async () => {
    await register(userData);
    navigate('/login');
  });

  return { submitting, error, handleRegister };
}
