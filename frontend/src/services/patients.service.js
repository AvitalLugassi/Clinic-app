import api from './api';

export const getMyDashboard = () => api.get('/patients/me/dashboard');
