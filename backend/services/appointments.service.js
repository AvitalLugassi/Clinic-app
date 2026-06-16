const appointmentsModel = require('../models/appointments.model');

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

module.exports = {
    getAvailableSlots,
    createAppointment,
    updateAppointmentStatus,
    getPatientAppointments
};