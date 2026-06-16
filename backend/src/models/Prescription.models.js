import pool from '../config/db.mysql.js';

export const getPatientPrescriptions = async (userId) => {
  const [rows] = await pool.query(
    `SELECT pr.id, pr.prescription_uuid, pr.medications, pr.dosage,
            pr.instructions, pr.valid_until, pr.created_at,
            u.full_name AS doctor_name
     FROM prescriptions pr
     JOIN users u ON u.id = pr.doctor_id
     WHERE pr.patient_id = (SELECT id FROM patients WHERE user_id = ?)
     ORDER BY pr.valid_until DESC`,
    [userId]
  );
  return rows;
};
