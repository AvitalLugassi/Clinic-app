import pool from '../config/db.mysql.js';

export const getDoctorDashboard = async (userId) => {
  const [[doctor]] = await pool.query(
    `SELECT u.id, u.full_name, u.email, u.phone,
            d.specialty, d.license_number,
            dep.name AS department
     FROM users u
     JOIN doctors d ON d.user_id = u.id
     LEFT JOIN departments dep ON dep.id = d.department_id
     WHERE u.id = ?`,
    [userId]
  );

  const [appointments] = await pool.query(
    `SELECT a.id, a.appointment_uuid, a.scheduled_at, a.status, a.notes,
            u.full_name AS patient_name
     FROM appointments a
     JOIN users u ON u.id = a.patient_id
     WHERE a.doctor_id = ?
       AND a.scheduled_at >= NOW()
       AND a.status != 'cancelled'
     ORDER BY a.scheduled_at ASC
     LIMIT 10`,
    [userId]
  );

  return { doctor, appointments };
};

export const getAllDoctors = async () => {
  const [rows] = await pool.query(
    `SELECT u.id, u.full_name, d.specialty, dep.name AS department
     FROM users u
     JOIN doctors d ON d.user_id = u.id
     LEFT JOIN departments dep ON dep.id = d.department_id
     WHERE u.role = 'doctor'`
  );
  return rows;
};
