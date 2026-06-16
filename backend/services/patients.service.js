import { getPatientDashboard } from '../models/Patient.js';

export const fetchPatientDashboard = async (userId) => {
  return await getPatientDashboard(userId);
};
