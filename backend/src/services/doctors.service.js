import { getDoctorDashboard, getAllDoctors } from '../models/Doctor.models.js';

export const fetchDoctorDashboard = async (userId) => {
  return await getDoctorDashboard(userId);
};

export const fetchAllDoctors = async () => {
  return await getAllDoctors();
};
