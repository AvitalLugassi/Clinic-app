import pool from '../config/db.mysql.js';

export const createPrescription = async ({ doctor_id, patient_id, medications, dosage, instructions, valid_until }) => {
  const [result] = await pool.query(
    `INSERT INTO prescriptions (prescription_uuid, doctor_id, patient_id, medications, dosage, instructions, valid_until)
     VALUES (UUID(), ?, ?, ?, ?, ?, ?)`,
    [doctor_id, patient_id, medications, dosage, instructions, valid_until]
  );
  return result.insertId;
};

export const getPatientPrescriptions = async (userId) => {
  const [rows] = await pool.query(
    `SELECT pr.id AS prescription_id, pr.prescription_uuid, pr.medications, pr.dosage,
            pr.instructions, pr.valid_until, pr.created_at,
            u.full_name AS doctor_name
     FROM prescriptions pr
     JOIN users u ON u.id = pr.doctor_id
     WHERE pr.patient_id = ?
     ORDER BY pr.valid_until DESC`,
    [userId]
  );
  return rows;
};

export const getPrescriptionsByPatientId = async (patientId) => {
  const [rows] = await pool.query(
    `SELECT pr.id, pr.prescription_uuid, pr.medications, pr.dosage,
            pr.instructions, pr.valid_until, pr.created_at,
            u.full_name AS doctor_name
     FROM prescriptions pr
     JOIN users u ON u.id = pr.doctor_id
     WHERE pr.patient_id = ?
     ORDER BY pr.valid_until DESC`,
    [patientId]
  );
  return rows;
};
