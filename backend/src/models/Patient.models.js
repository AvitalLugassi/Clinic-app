import pool from '../config/db.mysql.js';

export const getPatientDashboard = async (userId) => {
  const [[patient]] = await pool.query(
    `SELECT u.id, u.full_name, u.email, u.phone,
            p.date_of_birth, p.blood_type, p.allergies,
            p.address, p.emergency_contact_name, p.emergency_contact_phone
     FROM users u
     JOIN patients p ON p.user_id = u.id
     WHERE u.id = ?`,
    [userId]
  );

  const [appointments] = await pool.query(
    `SELECT a.id, a.appointment_uuid, a.scheduled_at, a.status, a.notes,
            u.full_name AS doctor_name, d.specialty, dep.name AS department
     FROM appointments a
     JOIN users u   ON u.id = a.doctor_id
     JOIN doctors d ON d.user_id = a.doctor_id
     LEFT JOIN departments dep ON dep.id = d.department_id
     WHERE a.patient_id = ?
       AND a.scheduled_at >= NOW()
       AND a.status != 'cancelled'
     ORDER BY a.scheduled_at ASC
     LIMIT 5`,
    [userId]
  );

  const [prescriptions] = await pool.query(
    `SELECT pr.id, pr.prescription_uuid, pr.medications, pr.dosage,
            pr.instructions, pr.valid_until, pr.created_at,
            u.full_name AS doctor_name
     FROM prescriptions pr
     JOIN users u ON u.id = pr.doctor_id
     WHERE pr.patient_id = ?
       AND pr.valid_until >= CURDATE()
     ORDER BY pr.valid_until ASC`,
    [userId]
  );

  return { patient, appointments, prescriptions };
};
