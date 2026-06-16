import { Server } from 'socket.io';
import Notification from '../models/Notification.js';

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: 'http://localhost:5173', credentials: true },
  });

  io.on('connection', (socket) => {
    socket.on('join', (userId) => {
      if (userId) socket.join(`user_${userId}`);
    });

    socket.on('disconnect', () => {});
  });

  return io;
};

export const sendNotification = async (userId, message, type = 'info') => {
  await Notification.create({ userId, message, type });
  io?.to(`user_${userId}`).emit('notification', { message, type });
};

export const getIo = () => io;
