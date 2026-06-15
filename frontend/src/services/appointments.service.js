import api from './api';

const appointmentsService = {
  getAppointments: () => api.get('/appointments').then(r => r.data),

  getDepartments: () => api.get('/departments').then(r => r.data),

  getDoctorsByDepartment: (departmentId) =>
    api.get(`/doctors?department_id=${departmentId}`).then(r => r.data),

  getDoctorAvailability: (doctorId, dayName) =>
    api.get(`/doctors/${doctorId}/availability?day=${dayName}`).then(r => r.data),

  getBookedSlots: (doctorId, date) =>
    api.get(`/appointments/booked?doctor_id=${doctorId}&date=${date}`).then(r => r.data),

  bookAppointment: (data) => api.post('/appointments', data).then(r => r.data),
};

export default appointmentsService;
