import { createContext, useState, useContext, useEffect } from 'react';
import { getMe, patientLogin, staffLogin, logout as logoutService } from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const loginPatient = async (credentials) => {
    await patientLogin(credentials);
    const me = await getMe();
    setUser(me);
    return me;
  };

  const loginStaff = async (credentials) => {
    await staffLogin(credentials);
    const me = await getMe();
    setUser(me);
    return me;
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
