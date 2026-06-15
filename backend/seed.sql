-- ניקוי טבלאות
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE notifications;
TRUNCATE TABLE prescriptions;
TRUNCATE TABLE appointments;
TRUNCATE TABLE doctor_availability;
TRUNCATE TABLE patients;
TRUNCATE TABLE doctors;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;

-- Users
INSERT INTO users (id, user_uuid, full_name, email, password_hash, national_id_hash, role, phone, is_active, is_app_registered) VALUES (1, UUID(), 'יוסי כהן', 'yossi.cohen@clinic-app.com', '$2b$10$mRFC2Uvad3AQZ0Zf.HWKuet4FMPMhN3BXGjbyypaLjF0Z7gSd.AS6', '3a05e64902ddfa9004647511df4d8860315e30324da1c360ed7f639bf979cb69', 'admin', '050-1000001', 1, 1);
INSERT INTO users (id, user_uuid, full_name, email, password_hash, national_id_hash, role, phone, is_active, is_app_registered) VALUES (2, UUID(), 'מירי לוי', 'miri.levi@clinic-app.com', '$2b$10$H.fvr/19LT/9G.RTBqO0q.cpK4Ij2.sx9648K9RoHi/M4DAdU1Wne', '1a84c86a339c26b05dae1de9efbcc0903cff9dac5c686ce0e776e1f147c1a47b', 'admin', '050-1000002', 1, 1);
INSERT INTO users (id, user_uuid, full_name, email, password_hash, national_id_hash, role, phone, is_active, is_app_registered) VALUES (3, UUID(), 'ד"ר רובי חן', 'robi.chen@clinic-app.com', '$2b$10$olX22TPsJYp5OS9V5V5i4.MAerkCneWkKD19CDwmJbh0b8jDOz8/q', '4bfb4cb1c349ea3e3bbd3b299321c6e7ef5f6854f06aacf5f776459321224b8c', 'doctor', '050-2000001', 1, 1);
INSERT INTO users (id, user_uuid, full_name, email, password_hash, national_id_hash, role, phone, is_active, is_app_registered) VALUES (4, UUID(), 'ד"ר שרה גולן', 'sara.golan@clinic-app.com', '$2b$10$FxRW4OaCYc9HS6yAm0N4H.b/cHi9WYza4kp6lSJTqsr2ZMnEC0wLi', 'fbfc6d04ef3e2f23437cf02741a17dc1252dbc902cf92e9029d51b1388fe7ef2', 'doctor', '050-2000002', 1, 1);
INSERT INTO users (id, user_uuid, full_name, email, password_hash, national_id_hash, role, phone, is_active, is_app_registered) VALUES (5, UUID(), 'ד"ר מיכאל אדם', 'michael.adam@clinic-app.com', '$2b$10$2e3zbkji1pg1mdxTXZFoPOkqwDGUL/uOEHGXZlfapE1aXZdN0VH22', '7ad98565d3417220a21a148921f500eeb47e30d2e00a53c8a81213cdfd837fff', 'doctor', '050-2000003', 1, 1);
INSERT INTO users (id, user_uuid, full_name, email, password_hash, national_id_hash, role, phone, is_active, is_app_registered) VALUES (6, UUID(), 'ד"ר אמילי טל', 'emily.tal@clinic-app.com', '$2b$10$gJGzAYibBcZuquUKMpe7Fu2HFZfLKbCNXytNEZcWmUwzOSkbIQ.He', '952972fdf45c6dfc14023dede486bd910b39f194199c40a9367deb8d38e628e4', 'doctor', '050-2000004', 1, 1);
INSERT INTO users (id, user_uuid, full_name, email, password_hash, national_id_hash, role, phone, is_active, is_app_registered) VALUES (7, UUID(), 'יעקב וילסון', 'yaakov.wilson@gmail.com', '$2b$10$pyCwnJLvajYtnbWidWA9SeCcsI4gOLyBtuHAkRGByVuFYHfCbJC0u', '36c594a65cc2c07bbbb956722858b80cd43b524a473676bde55524c563468307', 'patient', '050-3000001', 1, 1);
INSERT INTO users (id, user_uuid, full_name, email, password_hash, national_id_hash, role, phone, is_active, is_app_registered) VALUES (8, UUID(), 'אמה בראון', 'emma.brown@gmail.com', '$2b$10$Y8NLLzNkKmdEQy8HsHv4g.Yh1QnBbFj1.OrJRHX2DYZLxnXjNYNey', 'dd4d4deacd86a8d797bcbf431cf6e1126bb23248c6fab767f8588f3eabdeb5d9', 'patient', '050-3000002', 1, 1);
INSERT INTO users (id, user_uuid, full_name, email, password_hash, national_id_hash, role, phone, is_active, is_app_registered) VALUES (9, UUID(), 'דוד מילר', 'david.miller@gmail.com', '$2b$10$sFoDecKBCkBUDzFQNFal5e86sjQBBIhROxGW97QJK2/NRGX57mPAS', '99fa0741122360bc4d7fb09dc44d3a021607c666964e4f0ba99b971c2168d5e7', 'patient', '050-3000003', 1, 1);
INSERT INTO users (id, user_uuid, full_name, email, password_hash, national_id_hash, role, phone, is_active, is_app_registered) VALUES (10, UUID(), 'אוליביה דיוויס', 'olivia.davis@gmail.com', '$2b$10$cCQT37SVQpJzpwaC1B9gg.aQD0sxmH3KvNI8GS3pJEvbKAV415gf6', '49f4f332bdd72ee6c8172e5be1cca231a2bb751932dfeee4955caecd220a4e09', 'patient', '050-3000004', 1, 1);
INSERT INTO users (id, user_uuid, full_name, email, password_hash, national_id_hash, role, phone, is_active, is_app_registered) VALUES (11, UUID(), 'דניאל גרציה', 'daniel.garcia@gmail.com', '$2b$10$kEVxRqUDR3diIdrzDK2nj.z7z.n3rr1TCcDJ6v7t9DGhWbrzlbSgy', '605eee7997106ca00433dea9010de16204c8f7626910faa8e80aebd836cc3c7f', 'patient', '050-3000005', 1, 1);
INSERT INTO users (id, user_uuid, full_name, email, password_hash, national_id_hash, role, phone, is_active, is_app_registered) VALUES (12, UUID(), 'סופיה מרטינז', 'sophia.martinez@gmail.com', '$2b$10$tUaERsLWw4zKYivqpL0SlO40bE.A3bxYt9DWTNIYIFTw5MHnyAs3C', 'c62767456259119c77b3f82ea32c46180118b2ec564e1e5666762c2f6a8bc3ac', 'patient', '050-3000006', 1, 1);

-- Departments
INSERT INTO departments (id, name, description, is_active) VALUES
(1, 'רפואה כללית', 'מרפאה ראשונית', 1),
(2, 'ילדים', 'טיפול בתינוקות וילדים', 1),
(3, 'קרדיולוגיה', 'בריאות לב וכלי דם', 1),
(4, 'עור', 'טיפול בעור שיער וציפורניים', 1);

-- Doctors
INSERT INTO doctors (user_id, license_number, specialty, department_id, session_duration_min, available_days) VALUES
(3, 'LIC-99201', 'רופא משפחה',   1, 20, 'Sun,Mon,Tue,Wed'),
(4, 'LIC-44102', 'רופאת ילדים',  2, 15, 'Mon,Tue,Thu'),
(5, 'LIC-88304', 'קרדיולוג',     3, 30, 'Sun,Wed,Fri'),
(6, 'LIC-11509', 'עורולוג',      4, 20, 'Tue,Wed,Thu');

-- Patients
INSERT INTO patients (user_id, date_of_birth, blood_type, allergies) VALUES
(7,  '1984-04-12', 'A+',  'פניצילין'),
(8,  '1995-08-23', 'O-',  'בוטנים, אבקה'),
(9,  '1972-11-03', 'B+',  'אין'),
(10, '2018-01-15', 'AB+', 'אמוקסיציליין'),
(11, '1965-06-30', 'O+',  'תרופות סולפה'),
(12, '2021-09-09', 'A-',  'אין');

-- Doctor Availability
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time) VALUES
(3, 'Sun', '08:00:00', '14:00:00'),
(3, 'Mon', '08:00:00', '14:00:00'),
(3, 'Tue', '12:00:00', '18:00:00'),
(4, 'Mon', '09:00:00', '15:00:00'),
(4, 'Thu', '09:00:00', '15:00:00'),
(5, 'Sun', '08:00:00', '13:00:00'),
(5, 'Wed', '13:00:00', '17:00:00'),
(6, 'Wed', '10:00:00', '16:00:00');

-- Appointments
INSERT INTO appointments (id, appointment_uuid, patient_id, doctor_id, scheduled_at, duration_minutes, status, notes) VALUES
(1, UUID(), 7,  3, '2026-06-14 09:00:00', 20, 'completed', 'בדיקה שנתית שגרתית.'),
(2, UUID(), 8,  3, '2026-06-14 10:20:00', 20, 'completed', 'מעקב לחץ דם.'),
(3, UUID(), 10, 4, '2026-06-15 09:30:00', 15, 'completed', 'חיסון ילדים.'),
(4, UUID(), 9,  5, '2026-06-17 14:00:00', 30, 'confirmed', 'בדיקת אקו לב.'),
(5, UUID(), 11, 6, '2026-06-17 10:30:00', 20, 'confirmed', 'ייעוץ פריחה כרונית.'),
(6, UUID(), 12, 4, '2026-06-18 11:00:00', 15, 'pending',   'שיעול עונתי קל.'),
(7, UUID(), 7,  5, '2026-06-19 09:00:00', 30, 'pending',   'הפניה לניטור קצב לב.');

-- Prescriptions
INSERT INTO prescriptions (id, prescription_uuid, appointment_id, doctor_id, patient_id, medications, dosage, instructions, valid_until) VALUES
(1, UUID(), 1, 3, 7,  'אמוקסיציליין 500mg',      'כמוסה 3 פעמים ביום',       'לקחת עם אוכל 7 ימים.',          '2026-07-14'),
(2, UUID(), 2, 3, 8,  'ליסינופריל 10mg',          'טבלית אחת בבוקר',           'לעקוב אחר לחץ דם שבועית.',      '2026-12-31'),
(3, UUID(), 3, 4, 10, 'פרצטמול סירופ',            '5ml כל 6 שעות לפי הצורך',   'רק לחום מעל 38.5.',             '2026-06-30'),
(4, UUID(), 5, 6, 11, 'הידרוקורטיזון קרם 1%',    'שכבה דקה פעמיים ביום',      'שימוש חיצוני על האזור בלבד.',  '2026-07-17');

-- Notifications
INSERT INTO notifications (user_id, type, message, is_read, sent_at) VALUES
(7,  'appointment',  'התור שלך עם ד"ר רובי חן אושר.',              1, '2026-06-10 10:00:00'),
(7,  'prescription', 'מרשם חדש הונפק עבורך.',                       1, '2026-06-14 09:30:00'),
(10, 'reminder',     'תזכורת: מחר תור ב-09:30 עם ד"ר שרה גולן.',   0, '2026-06-14 18:00:00'),
(9,  'appointment',  'התור שלך עם ד"ר מיכאל אדם נקבע.',            0, '2026-06-11 12:15:00'),
(12, 'general',      'ברוך הבא למערכת המטופלים של הקליניקה!',       1, '2026-06-09 08:00:00');

-- סיכום משתמשים לבדיקות:
-- admin   | יוסי כהן           | מייל: yossi.cohen@clinic-app.com | סיסמה: Admin1234
-- admin   | מירי לוי           | מייל: miri.levi@clinic-app.com | סיסמה: Admin1234
-- doctor  | ד"ר רובי חן        | מייל: robi.chen@clinic-app.com | סיסמה: Doctor123
-- doctor  | ד"ר שרה גולן       | מייל: sara.golan@clinic-app.com | סיסמה: Doctor123
-- doctor  | ד"ר מיכאל אדם      | מייל: michael.adam@clinic-app.com | סיסמה: Doctor123
-- doctor  | ד"ר אמילי טל       | מייל: emily.tal@clinic-app.com | סיסמה: Doctor123
-- patient | יעקב וילסון        | ת"ז: 026761156 | סיסמה: Patient123
-- patient | אמה בראון          | ת"ז: 052305188 | סיסמה: Patient123
-- patient | דוד מילר           | ת"ז: 048672539 | סיסמה: Patient123
-- patient | אוליביה דיוויס     | ת"ז: 063758241 | סיסמה: Patient123
-- patient | דניאל גרציה        | ת"ז: 071234560 | סיסמה: Patient123
-- patient | סופיה מרטינז       | ת"ז: 057846932 | סיסמה: Patient123
