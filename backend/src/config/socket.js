import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: 'http://localhost:5173', credentials: true },
  });

  io.on('connection', (socket) => {
    socket.on('join', (userId) => {
      socket.join(`user_${userId}`);
    });
  });

  return io;
};

export const getIo = () => io;