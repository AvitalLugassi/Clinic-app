import api from './api';

export const getMyPrescriptions = async () => {
  const response = await api.get('/prescriptions/my');
  return response.data;
};

export const createPrescription = async (data) => {
  const response = await api.post('/prescriptions', data);
  return response.data;
};

export const getPatientPrescriptions = async (patientId) => {
  const response = await api.get(`/prescriptions/my?patient_id=${patientId}`);
  return response.data;
};
