import appointmentsModel from '../models/Appointment.js';

const getAvailableSlots = async (doctorId, date) => {
    return await appointmentsModel.getAvailableSlots(doctorId, date);
};

const createAppointment = async (appointmentUuid, patientId, doctorId, scheduledAt, status) => {
    return await appointmentsModel.createAppointment(appointmentUuid, patientId, doctorId, scheduledAt, status);
};

const updateAppointmentStatus = async (appointmentId, status) => {
    return await appointmentsModel.updateAppointmentStatus(appointmentId, status);
};

const getPatientAppointments = async (patientId) => {
    return await appointmentsModel.getPatientAppointments(patientId);
};

const getDoctorAppointments = async (doctorId) => {
    return await appointmentsModel.getAppointmentsByDoctor(doctorId);
};

export default {
    getAvailableSlots,
    createAppointment,
    updateAppointmentStatus,
    getPatientAppointments,
    getDoctorAppointments
};