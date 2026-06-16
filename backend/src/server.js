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
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await testConnection();   // בדיקת חיבור MySQL
  await connectMongo();     // הפעלת חיבור MongoDB (הורדנו את ה- //)
});