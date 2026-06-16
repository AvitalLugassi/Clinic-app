import api from './api';

export const getMyPrescriptions = async () => {
  const response = await api.get('/prescriptions/my');
  return response.data;
};
