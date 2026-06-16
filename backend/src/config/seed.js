import pool from './db.mysql.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

const hashId = (id) => crypto.createHash('sha256').update(String(id)).digest('hex');

const seed = async () => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(`
      INSERT IGNORE INTO departments (id, name, description, is_active) VALUES
      (1, 'Cardiology',   'Heart and cardiovascular system', 1),
      (2, 'Neurology',    'Brain and nervous system',        1),
      (3, 'General',      'General medicine',                1)
    `);

    // ── Users ────────────────────────────────────────────────────
    const adminPass  = await bcrypt.hash('Admin123!',   10);
    const doctorPass = await bcrypt.hash('Doctor123!',  10);
    const patientPass= await bcrypt.hash('Patient123!', 10);

    const adminId = '100000001';
    const doc1Id = '200000111';
    const doc2Id = '200000122';
    const patient1Id = '100000009';
    const patient2Id = '100000017';

    const users = [
      // id, uuid, full_name, email, password, role, national_id_hash
      [1, uuidv4(), 'Admin User',      'admin@clinic-app.com',    adminPass,   'admin',   hashId(adminId)],
      [2, uuidv4(), 'Dr. Sara Cohen',  'sara@clinic-app.com',     doctorPass,  'doctor',  hashId(doc1Id)],
      [3, uuidv4(), 'Dr. Yoni Levi',   'yoni@clinic-app.com',     doctorPass,  'doctor',  hashId(doc2Id)],
      [4, uuidv4(), 'Moshe Israeli',   'moshe@clinic-app.com',    patientPass, 'patient', hashId(patient1Id)],
      [5, uuidv4(), 'Tamar Katz',      'tamar@clinic-app.com',    patientPass, 'patient', hashId(patient2Id)],
    ];

    for (const [id, uuid, name, email, pass, role, nationalIdHash] of users) {
      await conn.query(`
        INSERT IGNORE INTO users
          (id, user_uuid, full_name, email, password_hash, role, phone, is_active, created_at, is_app_registered,
           national_id_encrypted, national_id_hash)
        VALUES (?, ?, ?, ?, ?, ?, '050-0000000', 1, NOW(), 1, '', ?)
      `, [id, uuid, name, email, pass, role, nationalIdHash]);
    }

    // ── Doctors ──────────────────────────────────────────────────
    await conn.query(`
      INSERT IGNORE INTO doctors
        (user_id, license_number, specialty, department_id, session_duration_min, available_days, created_at)
      VALUES
        (2, 'LIC-001', 'Cardiologist', 1, 30, 'Sun,Mon,Tue,Wed,Thu', NOW()),
        (3, 'LIC-002', 'Neurologist',  2, 45, 'Mon,Tue,Wed,Thu,Fri', NOW())
    `);

    // ── Patients ─────────────────────────────────────────────────
    await conn.query(`
      INSERT IGNORE INTO patients
        (user_id, date_of_birth, insurance_number_encrypted, insurance_number_hash,
         address, emergency_contact_name, emergency_contact_phone, blood_type, allergies, created_at)
      VALUES
        (4, '1990-05-15', '', '', 'Tel Aviv, Herzl 1',    'Avi Israeli',  '052-1111111', 'A+', 'None', NOW()),
        (5, '1985-11-20', '', '', 'Jerusalem, Jaffa 5',   'Ron Katz',     '052-2222222', 'O-', 'Penicillin', NOW())
    `);

    // ── Appointments ─────────────────────────────────────────────
    const appt1 = uuidv4(), appt2 = uuidv4();
    await conn.query(`
      INSERT IGNORE INTO appointments
        (id, appointment_uuid, patient_id, doctor_id, scheduled_at, duration_minutes, status, notes, created_at)
      VALUES
        (1, ?, 4, 2, '2025-08-10 09:00:00', 30, 'confirmed', 'Routine checkup',      NOW()),
        (2, ?, 5, 3, '2025-08-11 11:00:00', 45, 'pending',   'Follow-up headaches',  NOW())
    `, [appt1, appt2]);

    // ── Prescriptions ─────────────────────────────────────────────
    await conn.query(`
      INSERT IGNORE INTO prescriptions
        (prescription_uuid, appointment_id, doctor_id, patient_id,
         medications, dosage, instructions, valid_until, pdf_path, created_at)
      VALUES
        (?, 1, 2, 4, 'Aspirin', '100mg once daily', 'Take after meals', '2025-12-31', '', NOW()),
        (?, 2, 3, 5, 'Ibuprofen', '400mg twice daily', 'Take with water', '2025-10-31', '', NOW())
    `, [uuidv4(), uuidv4()]);

    await conn.commit();
    console.log('✅ Seed completed successfully!');
    console.log('\n📋 Login credentials:');
    console.log(`  Admin:    admin@clinic-app.com   / Admin123!  (national ID: ${adminId})`);
    console.log(`  Doctor 1: sara@clinic-app.com    / Doctor123!  (national ID: ${doc1Id})`);
    console.log(`  Doctor 2: yoni@clinic.app    / Doctor123!  (national ID: ${doc2Id})`);
    console.log(`  Patient 1: moshe@clinic.app  / Patient123!  / ID ${patient1Id}`);
    console.log(`  Patient 2: tamar@clinic.app  / Patient123!  / ID ${patient2Id}`);
  } catch (err) {
    await conn.rollback();
    console.error('❌ Seed failed:', err.message);
  } finally {
    conn.release();
    process.exit(0);
  }
};

seed();
