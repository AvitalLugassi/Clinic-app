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
import connectMongo from './config/db.mongo.js'; // הורדנו את ה- //

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

const startServer = async () => {
  try {
    await testConnection();   // בדיקת חיבור MySQL
    await connectMongo();     // הפעלת חיבור MongoDB

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Startup failed:', err.message || err);
    process.exit(1);
  }
};

startServer();