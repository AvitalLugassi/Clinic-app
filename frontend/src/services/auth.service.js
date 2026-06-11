import api from './api';

export const patientLogin = (credentials) => api.post('/auth/patient-login', credentials);
export const staffLogin = (credentials) => api.post('/auth/staff-login', credentials);
export const patientPreRegister = (data) => api.post('/auth/patient-pre-register', data);
export const patientCompleteRegister = (data) => api.post('/auth/patient-complete-register', data);
export const staffRegister = (data) => api.post('/auth/staff-register', data);
export const adminRegisterPatient = (data) => api.post('/auth/admin-register-patient', data);
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');
