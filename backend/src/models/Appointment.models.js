import db from '../config/db.mysql.js';

const getAvailableSlots = async (doctorId, date) => {
    const query = `
        SELECT DATE_FORMAT(scheduled_at, '%H:%i') as booked_time 
        FROM appointments 
        WHERE doctor_id = ? AND DATE(scheduled_at) = ? AND status != 'cancelled'
    `;
    const [rows] = await db.execute(query, [doctorId, date]);
    return rows.map(row => row.booked_time);
};

const createAppointment = async (appointmentUuid, patientId, doctorId, scheduledAt, status) => {
    const query = `
        INSERT INTO appointments (appointment_uuid, patient_id, doctor_id, scheduled_at, status) 
        VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [appointmentUuid, patientId, doctorId, scheduledAt, status]);
    return result.insertId;
};

const updateAppointmentStatus = async (appointmentId, status) => {
    const query = `
        UPDATE appointments 
        SET status = ? 
        WHERE id = ?
    `;
    const [result] = await db.execute(query, [status, appointmentId]);
    return result.affectedRows > 0;
};

const getPatientAppointments = async (patientId) => {
    const query = `
        SELECT a.id, a.appointment_uuid, a.scheduled_at, a.status, a.notes, a.doctor_id,
               u.full_name as doctor_name, d.specialty, dep.name as department
        FROM appointments a
        JOIN users u ON a.doctor_id = u.id
        JOIN doctors d ON d.user_id = u.id
        LEFT JOIN departments dep ON dep.id = d.department_id
        WHERE a.patient_id = ?
        ORDER BY a.scheduled_at DESC
    `;
    const [rows] = await db.execute(query, [patientId]);
    return rows;
};

const getAppointmentsByDoctor = async (doctorId) => {
    const query = `
        SELECT a.id, a.appointment_uuid, a.scheduled_at, a.status,
               u.full_name as patient_name
        FROM appointments a
        JOIN users u ON a.patient_id = u.id
        WHERE a.doctor_id = ?
        ORDER BY a.scheduled_at DESC
    `;
    const [rows] = await db.execute(query, [doctorId]);
    return rows;
};

export default {
    getAvailableSlots,
    createAppointment,
    updateAppointmentStatus,
    getPatientAppointments,
    getAppointmentsByDoctor,
};