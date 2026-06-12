import { createContext, useState, useContext } from 'react';
import { getMe, patientLogin, staffLogin, logout as logoutService } from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const loginPatient = async (credentials) => {
    await patientLogin(credentials);
    const me = await getMe();
    setUser(me.data);
    return me.data;
  };

  const loginStaff = async (credentials) => {
    await staffLogin(credentials);
    const me = await getMe();
    setUser(me.data);
    return me.data;
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
