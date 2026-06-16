import http from 'http';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import patientRoutes from './routes/patients.routes.js';
import appointmentRoutes from './routes/appointments.routes.js';
import doctorRoutes from './routes/doctors.routes.js';
import prescriptionRoutes from './routes/prescriptions.routes.js';
import { logger } from './middleware/logger.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import { testConnection } from './config/db.mysql.js';
import connectMongo from './config/db.mongo.js';
import { initSocket } from './config/socket.js';

dotenv.config();
const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

process.on('unhandledRejection', (err) => {
  console.error('DB/Unhandled error:', err.message);
});
app.use(express.json());
app.use(cookieParser());

// רישום הראוטים במערכת
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/prescriptions', prescriptionRoutes);

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err && err.stack ? err.stack : err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
  process.exit(1);
});

server.on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`EADDRINUSE: Port ${PORT} is already in use.`, err);
  } else {
    console.error('Server error:', err);
  }
});

const start = async () => {
  try {
    // Ensure DB connections are healthy before starting to listen
    await testConnection();
    await connectMongo();
    // attach sockets after DB is ready
    initSocket(server);
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server due to initialization error:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
};

start();