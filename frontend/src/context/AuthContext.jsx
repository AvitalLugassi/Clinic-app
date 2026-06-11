import { createContext, useState, useEffect, useContext } from 'react';
import { getMe, patientLogin, staffLogin, logout as logoutService } from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const loginPatient = async (credentials) => {
    const res = await patientLogin(credentials);
    setUser(res.data);
    return res.data;
  };

  const loginStaff = async (credentials) => {
    const res = await staffLogin(credentials);
    setUser(res.data);
    return res.data;
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginPatient, loginStaff, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
