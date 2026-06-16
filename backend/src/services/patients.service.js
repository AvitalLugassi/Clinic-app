import { getPatientDashboard } from '../models/Patient.models.js';

export const fetchPatientDashboard = async (userId) => {
  return await getPatientDashboard(userId);
};
