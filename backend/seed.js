import bcrypt from 'bcrypt';
import crypto from 'crypto';

const hashId = (id) => crypto.createHash('sha256').update(String(id)).digest('hex');
const hashPass = (p) => bcrypt.hash(p, 10);

// ת"ז ישראליות תקינות
const USERS = [
  // admins
  { id: 1, full_name: 'יוסי כהן',      email: 'yossi.cohen@clinic-app.com',   password: 'Admin1234', role: 'admin',   phone: '050-1000001', id_number: '025468179' },
  { id: 2, full_name: 'מירי לוי',       email: 'miri.levi@clinic-app.com',     password: 'Admin1234', role: 'admin',   phone: '050-1000002', id_number: '047867990' },
  // doctors
  { id: 3, full_name: 'ד"ר רובי חן',   email: 'robi.chen@clinic-app.com',     password: 'Doctor123', role: 'doctor',  phone: '050-2000001', id_number: '031497520' },
  { id: 4, full_name: 'ד"ר שרה גולן',  email: 'sara.golan@clinic-app.com',    password: 'Doctor123', role: 'doctor',  phone: '050-2000002', id_number: '028564951' },
  { id: 5, full_name: 'ד"ר מיכאל אדם', email: 'michael.adam@clinic-app.com',  password: 'Doctor123', role: 'doctor',  phone: '050-2000003', id_number: '074420830' },
  { id: 6, full_name: 'ד"ר אמילי טל',  email: 'emily.tal@clinic-app.com',     password: 'Doctor123', role: 'doctor',  phone: '050-2000004', id_number: '039523765' },
  // patients
  { id: 7,  full_name: 'יעקב וילסון',  email: 'yaakov.wilson@gmail.com',      password: 'Patient123', role: 'patient', phone: '050-3000001', id_number: '026761156' },
  { id: 8,  full_name: 'אמה בראון',    email: 'emma.brown@gmail.com',         password: 'Patient123', role: 'patient', phone: '050-3000002', id_number: '052305188' },
  { id: 9,  full_name: 'דוד מילר',     email: 'david.miller@gmail.com',       password: 'Patient123', role: 'patient', phone: '050-3000003', id_number: '048672539' },
  { id: 10, full_name: 'אוליביה דיוויס',email: 'olivia.davis@gmail.com',      password: 'Patient123', role: 'patient', phone: '050-3000004', id_number: '063758241' },
  { id: 11, full_name: 'דניאל גרציה',  email: 'daniel.garcia@gmail.com',      password: 'Patient123', role: 'patient', phone: '050-3000005', id_number: '071234560' },
  { id: 12, full_name: 'סופיה מרטינז', email: 'sophia.martinez@gmail.com',    password: 'Patient123', role: 'patient', phone: '050-3000006', id_number: '057846932' },
];

async function generate() {
  const lines = [];

  lines.push('-- ניקוי טבלאות');
  lines.push('SET FOREIGN_KEY_CHECKS = 0;');
  lines.push('TRUNCATE TABLE notifications;');
  lines.push('TRUNCATE TABLE prescriptions;');
  lines.push('TRUNCATE TABLE appointments;');
  lines.push('TRUNCATE TABLE doctor_availability;');
  lines.push('TRUNCATE TABLE patients;');
  lines.push('TRUNCATE TABLE doctors;');
  lines.push('TRUNCATE TABLE users;');
  lines.push('SET FOREIGN_KEY_CHECKS = 1;');
  lines.push('');
  lines.push('-- Users');

  for (const u of USERS) {
    const ph = await hashPass(u.password);
    const nh = hashId(u.id_number);
    const isPatient = u.role === 'patient';
    lines.push(
      `INSERT INTO users (id, user_uuid, full_name, email, password_hash, national_id_hash, role, phone, is_active, is_app_registered) VALUES ` +
      `(${u.id}, UUID(), '${u.full_name}', '${u.email}', '${ph}', '${nh}', '${u.role}', '${u.phone}', 1, ${isPatient ? 1 : 1});`
    );
  }

  lines.push('');
  lines.push('-- Departments');
  lines.push(`INSERT INTO departments (id, name, description, is_active) VALUES
(1, 'רפואה כללית', 'מרפאה ראשונית', 1),
(2, 'ילדים', 'טיפול בתינוקות וילדים', 1),
(3, 'קרדיולוגיה', 'בריאות לב וכלי דם', 1),
(4, 'עור', 'טיפול בעור שיער וציפורניים', 1);`);

  lines.push('');
  lines.push('-- Doctors');
  lines.push(`INSERT INTO doctors (user_id, license_number, specialty, department_id, session_duration_min, available_days) VALUES
(3, 'LIC-99201', 'רופא משפחה',   1, 20, 'Sun,Mon,Tue,Wed'),
(4, 'LIC-44102', 'רופאת ילדים',  2, 15, 'Mon,Tue,Thu'),
(5, 'LIC-88304', 'קרדיולוג',     3, 30, 'Sun,Wed,Fri'),
(6, 'LIC-11509', 'עורולוג',      4, 20, 'Tue,Wed,Thu');`);

  lines.push('');
  lines.push('-- Patients');
  lines.push(`INSERT INTO patients (user_id, date_of_birth, blood_type, allergies) VALUES
(7,  '1984-04-12', 'A+',  'פניצילין'),
(8,  '1995-08-23', 'O-',  'בוטנים, אבקה'),
(9,  '1972-11-03', 'B+',  'אין'),
(10, '2018-01-15', 'AB+', 'אמוקסיציליין'),
(11, '1965-06-30', 'O+',  'תרופות סולפה'),
(12, '2021-09-09', 'A-',  'אין');`);

  lines.push('');
  lines.push('-- Doctor Availability');
  lines.push(`INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time) VALUES
(3, 'Sun', '08:00:00', '14:00:00'),
(3, 'Mon', '08:00:00', '14:00:00'),
(3, 'Tue', '12:00:00', '18:00:00'),
(4, 'Mon', '09:00:00', '15:00:00'),
(4, 'Thu', '09:00:00', '15:00:00'),
(5, 'Sun', '08:00:00', '13:00:00'),
(5, 'Wed', '13:00:00', '17:00:00'),
(6, 'Wed', '10:00:00', '16:00:00');`);

  lines.push('');
  lines.push('-- Appointments');
  lines.push(`INSERT INTO appointments (id, appointment_uuid, patient_id, doctor_id, scheduled_at, duration_minutes, status, notes) VALUES
(1, UUID(), 7,  3, '2026-06-14 09:00:00', 20, 'completed', 'בדיקה שנתית שגרתית.'),
(2, UUID(), 8,  3, '2026-06-14 10:20:00', 20, 'completed', 'מעקב לחץ דם.'),
(3, UUID(), 10, 4, '2026-06-15 09:30:00', 15, 'completed', 'חיסון ילדים.'),
(4, UUID(), 9,  5, '2026-06-17 14:00:00', 30, 'confirmed', 'בדיקת אקו לב.'),
(5, UUID(), 11, 6, '2026-06-17 10:30:00', 20, 'confirmed', 'ייעוץ פריחה כרונית.'),
(6, UUID(), 12, 4, '2026-06-18 11:00:00', 15, 'pending',   'שיעול עונתי קל.'),
(7, UUID(), 7,  5, '2026-06-19 09:00:00', 30, 'pending',   'הפניה לניטור קצב לב.');`);

  lines.push('');
  lines.push('-- Prescriptions');
  lines.push(`INSERT INTO prescriptions (id, prescription_uuid, appointment_id, doctor_id, patient_id, medications, dosage, instructions, valid_until) VALUES
(1, UUID(), 1, 3, 7,  'אמוקסיציליין 500mg',      'כמוסה 3 פעמים ביום',       'לקחת עם אוכל 7 ימים.',          '2026-07-14'),
(2, UUID(), 2, 3, 8,  'ליסינופריל 10mg',          'טבלית אחת בבוקר',           'לעקוב אחר לחץ דם שבועית.',      '2026-12-31'),
(3, UUID(), 3, 4, 10, 'פרצטמול סירופ',            '5ml כל 6 שעות לפי הצורך',   'רק לחום מעל 38.5.',             '2026-06-30'),
(4, UUID(), 5, 6, 11, 'הידרוקורטיזון קרם 1%',    'שכבה דקה פעמיים ביום',      'שימוש חיצוני על האזור בלבד.',  '2026-07-17');`);

  lines.push('');
  lines.push('-- Notifications');
  lines.push(`INSERT INTO notifications (user_id, type, message, is_read, sent_at) VALUES
(7,  'appointment',  'התור שלך עם ד"ר רובי חן אושר.',              1, '2026-06-10 10:00:00'),
(7,  'prescription', 'מרשם חדש הונפק עבורך.',                       1, '2026-06-14 09:30:00'),
(10, 'reminder',     'תזכורת: מחר תור ב-09:30 עם ד"ר שרה גולן.',   0, '2026-06-14 18:00:00'),
(9,  'appointment',  'התור שלך עם ד"ר מיכאל אדם נקבע.',            0, '2026-06-11 12:15:00'),
(12, 'general',      'ברוך הבא למערכת המטופלים של הקליניקה!',       1, '2026-06-09 08:00:00');`);

  lines.push('');
  lines.push('-- סיכום משתמשים לבדיקות:');
  for (const u of USERS) {
    lines.push(`-- ${u.role.padEnd(7)} | ${u.full_name.padEnd(18)} | ${u.role === 'patient' ? 'ת"ז: ' + u.id_number : 'מייל: ' + u.email} | סיסמה: ${u.password}`);
  }

  console.log(lines.join('\n'));
}

generate();
