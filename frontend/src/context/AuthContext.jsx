import { createContext, useState, useContext, useEffect } from 'react';
import { patientLogin, staffLogin, logout as logoutService, getMe } from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        setUser(JSON.parse(raw));
      } else {
        setUser(null);
      }
    } catch (err) {
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const pickPublicUser = (u) => {
    if (!u || typeof u !== 'object') return null;
    const { _id, id, name, firstName, lastName, email, role, avatar, phone } = u;
    const out = {};
    out.id = _id ?? id ?? null;
    if (name) out.name = name;
    if (firstName) out.firstName = firstName;
    if (lastName) out.lastName = lastName;
    if (email) out.email = email;
    if (role) out.role = role;
    if (avatar) out.avatar = avatar;
    if (phone) out.phone = phone;
    return out;
  };

  const saveUser = (u) => {
    if (!u) {
      localStorage.removeItem('user');
      setUser(null);
      return;
    }
    const publicUser = pickPublicUser(u);
    localStorage.setItem('user', JSON.stringify(publicUser));
    setUser(publicUser);
  };

  const loginPatient = async (credentials) => {
    const data = await patientLogin(credentials);
    const maybeUser = data?.user ?? data;
    if (maybeUser) {
      saveUser(maybeUser);
      return maybeUser;
    }
    return null;
  };

  const loginStaff = async (credentials) => {
    const data = await staffLogin(credentials);
    const maybeUser = data?.user ?? data;
    if (maybeUser) {
      saveUser(maybeUser);
      return maybeUser;
    }
    return null;
  };

  const fetchUser = async () => {
    const me = await getMe();
    const publicUser = pickPublicUser(me);
    localStorage.setItem('user', JSON.stringify(publicUser));
    setUser(publicUser);
    return publicUser;
  };

  const logout = async () => {
    await logoutService();
    localStorage.removeItem('user');
    setUser(null);
  };

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== 'user') return;
      if (e.newValue) {
        try {
          setUser(JSON.parse(e.newValue));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, loginPatient, loginStaff, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
