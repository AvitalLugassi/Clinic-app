import { createContext, useContext, useState, useCallback } from 'react';
import { useAuthContext } from './AuthContext';
import useSocket from '../hooks/useSocket';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { user } = useAuthContext();
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  useSocket(user, {
    notification: (data) => {
      setNotifications((prev) => [data, ...prev]);
      addToast(data.message, data.type ?? 'info');
    },
  });

  const clearNotifications = () => setNotifications([]);
  const dismissToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <NotificationContext.Provider value={{ notifications, toasts, addToast, clearNotifications, dismissToast }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
