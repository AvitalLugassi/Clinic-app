import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

export default function useSocket(user, onEvent) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    socketRef.current = io(SOCKET_URL, { withCredentials: true });

    const socket = socketRef.current;

    socket.on('connect', () => {
    socket.emit('join', user.id);
    });

    if (onEvent) {
      Object.entries(onEvent).forEach(([event, handler]) => {
        socket.on(event, handler);
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [user?._id]);

  return socketRef.current;
}
