-- Backup for database clinic_management on 2026-06-16T19:33:29.296Z
SET FOREIGN_KEY_CHECKS=0;

-- Dumping table appointments
DELETE FROM `appointments`;
INSERT INTO `appointments` (`id`, `appointment_uuid`, `patient_id`, `doctor_id`, `scheduled_at`, `duration_minutes`, `status`, `notes`, `created_at`) VALUES
(1, 'f031cbf7-3c5e-4414-8edf-8915507cef51', 4, 2, 'Sun Aug 10 2025 09:00:00 GMT+0300 (שעון ישראל (קיץ))', 30, 'confirmed', 'Routine checkup', 'Tue Jun 16 2026 20:59:15 GMT+0300 (שעון ישראל (קיץ))'),
(2, 'e8949f73-eaf2-4756-b4a1-c69592686856', 5, 3, 'Mon Aug 11 2025 11:00:00 GMT+0300 (שעון ישראל (קיץ))', 45, 'pending', 'Follow-up headaches', 'Tue Jun 16 2026 20:59:15 GMT+0300 (שעון ישראל (קיץ))');

-- Dumping table departments
DELETE FROM `departments`;
INSERT INTO `departments` (`id`, `name`, `description`, `is_active`) VALUES
(1, 'General Medicine', 'Primary care and family medicine clinic', 1),
(2, 'Pediatrics', 'Comprehensive healthcare for infants, children, and adolescents', 1),
(3, 'Cardiology', 'Cardiovascular health evaluation and treatment', 1),
(4, 'Dermatology', 'Skin, hair, and nail medical care', 1);

-- Dumping table doctor_availability
-- Table doctor_availability is empty

-- Dumping table doctors
DELETE FROM `doctors`;
INSERT INTO `doctors` (`user_id`, `license_number`, `specialty`, `department_id`, `session_duration_min`, `available_days`, `created_at`) VALUES
(2, 'LIC-001', 'Cardiologist', 1, 30, 'Sun,Mon,Tue,Wed,Thu', 'Tue Jun 16 2026 20:59:15 GMT+0300 (שעון ישראל (קיץ))'),
(3, 'LIC-002', 'Neurologist', 2, 45, 'Mon,Tue,Wed,Thu,Fri', 'Tue Jun 16 2026 20:59:15 GMT+0300 (שעון ישראל (קיץ))');

-- Dumping table notifications
-- Table notifications is empty

-- Dumping table otps
DELETE FROM `otps`;
INSERT INTO `otps` (`id`, `user_id`, `code`, `purpose`, `expires_at`, `used`, `created_at`) VALUES
(3, 13, '442734', 'registration', 'Sun Jun 14 2026 13:39:30 GMT+0300 (שעון ישראל (קיץ))', 1, 'Sun Jun 14 2026 16:29:30 GMT+0300 (שעון ישראל (קיץ))'),
(4, 14, '568523', 'registration', 'Sun Jun 14 2026 13:49:59 GMT+0300 (שעון ישראל (קיץ))', 1, 'Sun Jun 14 2026 16:39:58 GMT+0300 (שעון ישראל (קיץ))');

-- Dumping table patients
DELETE FROM `patients`;
INSERT INTO `patients` (`user_id`, `date_of_birth`, `insurance_number_encrypted`, `insurance_number_hash`, `address`, `emergency_contact_name`, `emergency_contact_phone`, `blood_type`, `allergies`, `created_at`) VALUES
(4, 'Tue May 15 1990 00:00:00 GMT+0300 (שעון ישראל (קיץ))', '', '', 'Tel Aviv, Herzl 1', 'Avi Israeli', '052-1111111', 'A+', 'None', 'Tue Jun 16 2026 20:59:15 GMT+0300 (שעון ישראל (קיץ))'),
(5, 'Wed Nov 20 1985 00:00:00 GMT+0200 (שעון ישראל (חורף))', '', '', 'Jerusalem, Jaffa 5', 'Ron Katz', '052-2222222', 'O-', 'Penicillin', 'Tue Jun 16 2026 20:59:15 GMT+0300 (שעון ישראל (קיץ))'),
(13, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Sun Jun 14 2026 16:15:19 GMT+0300 (שעון ישראל (קיץ))'),
(14, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Sun Jun 14 2026 16:39:28 GMT+0300 (שעון ישראל (קיץ))');

-- Dumping table prescriptions
DELETE FROM `prescriptions`;
INSERT INTO `prescriptions` (`id`, `prescription_uuid`, `appointment_id`, `doctor_id`, `patient_id`, `medications`, `dosage`, `instructions`, `valid_until`, `pdf_path`, `created_at`) VALUES
(1, '2869f93c-1e8f-4c90-a221-eab78bf7246a', 1, 2, 4, 'Aspirin', '100mg once daily', 'Take after meals', 'Wed Dec 31 2025 00:00:00 GMT+0200 (שעון ישראל (חורף))', '', 'Tue Jun 16 2026 20:59:15 GMT+0300 (שעון ישראל (קיץ))'),
(2, 'a2623e6a-1c2a-47ba-9ba2-9b2e22b1486a', 2, 3, 5, 'Ibuprofen', '400mg twice daily', 'Take with water', 'Fri Oct 31 2025 00:00:00 GMT+0200 (שעון ישראל (חורף))', '', 'Tue Jun 16 2026 20:59:15 GMT+0300 (שעון ישראל (קיץ))'),
(3, 'd841cae2-f694-41f4-8aae-2ebfe69e023e', 1, 2, 4, 'Aspirin', '100mg once daily', 'Take after meals', 'Wed Dec 31 2025 00:00:00 GMT+0200 (שעון ישראל (חורף))', '', 'Tue Jun 16 2026 22:00:49 GMT+0300 (שעון ישראל (קיץ))'),
(4, '33e4b7e1-491b-4537-8ea2-8045aee52d12', 2, 3, 5, 'Ibuprofen', '400mg twice daily', 'Take with water', 'Fri Oct 31 2025 00:00:00 GMT+0200 (שעון ישראל (חורף))', '', 'Tue Jun 16 2026 22:00:49 GMT+0300 (שעון ישראל (קיץ))'),
(5, 'dcd2110f-764d-48ee-a135-3e6d9659c559', 1, 2, 4, 'Aspirin', '100mg once daily', 'Take after meals', 'Wed Dec 31 2025 00:00:00 GMT+0200 (שעון ישראל (חורף))', '', 'Tue Jun 16 2026 22:19:00 GMT+0300 (שעון ישראל (קיץ))'),
(6, '2eebc892-e253-423f-b79a-0dce59f8d0a8', 2, 3, 5, 'Ibuprofen', '400mg twice daily', 'Take with water', 'Fri Oct 31 2025 00:00:00 GMT+0200 (שעון ישראל (חורף))', '', 'Tue Jun 16 2026 22:19:00 GMT+0300 (שעון ישראל (קיץ))');

-- Dumping table refresh_tokens
DELETE FROM `refresh_tokens`;
INSERT INTO `refresh_tokens` (`id`, `user_id`, `token`, `expires_at`, `created_at`) VALUES
(4, 14, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsInJvbGUiOiJwYXRpZW50IiwiaWF0IjoxNzgxNDQ0NDkwLCJleHAiOjE3ODIwNDkyOTB9.kRjp4VWsrre5wiay6V2eHuuLVDzXUrqOfVi7p4WgPBA', 'Sun Jun 21 2026 13:41:30 GMT+0300 (שעון ישראל (קיץ))', 'Sun Jun 14 2026 16:41:30 GMT+0300 (שעון ישראל (קיץ))'),
(9, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzgxNjEwNTc4LCJleHAiOjE3ODIyMTUzNzh9.-xJLyIQgboVOMtICRN-b8YG16fKKgzKtc71qG7XLVGI', 'Tue Jun 23 2026 11:49:39 GMT+0300 (שעון ישראל (קיץ))', 'Tue Jun 16 2026 14:49:38 GMT+0300 (שעון ישראל (קיץ))');

-- Dumping table users
DELETE FROM `users`;
INSERT INTO `users` (`id`, `user_uuid`, `full_name`, `email`, `password_hash`, `national_id_encrypted`, `national_id_hash`, `role`, `phone`, `is_active`, `created_at`, `is_app_registered`) VALUES
(1, '5b811608-65d9-11f1-938a-0a0027000009', 'יוסי כהן', 'yossi.cohen@clinic-app.com', '$2b$10$mRFC2Uvad3AQZ0Zf.HWKuet4FMPMhN3BXGjbyypaLjF0Z7gSd.AS6', NULL, '3a05e64902ddfa9004647511df4d8860315e30324da1c360ed7f639bf979cb69', 'admin', '050-1000001', 1, 'Fri Jun 12 2026 00:06:04 GMT+0300 (שעון ישראל (קיץ))', 1),
(2, '5b818bad-65d9-11f1-938a-0a0027000009', 'מירי לוי', 'miri.levi@clinic-app.com', '$2b$10$H.fvr/19LT/9G.RTBqO0q.cpK4Ij2.sx9648K9RoHi/M4DAdU1Wne', NULL, '1a84c86a339c26b05dae1de9efbcc0903cff9dac5c686ce0e776e1f147c1a47b', 'admin', '050-1000002', 1, 'Fri Jun 12 2026 00:06:04 GMT+0300 (שעון ישראל (קיץ))', 1),
(3, '5b81cb99-65d9-11f1-938a-0a0027000009', 'ד"ר רובי חן', 'robi.chen@clinic-app.com', '$2b$10$olX22TPsJYp5OS9V5V5i4.MAerkCneWkKD19CDwmJbh0b8jDOz8/q', NULL, '4bfb4cb1c349ea3e3bbd3b299321c6e7ef5f6854f06aacf5f776459321224b8c', 'doctor', '050-2000001', 1, 'Fri Jun 12 2026 00:06:04 GMT+0300 (שעון ישראל (קיץ))', 1),
(4, '5b820494-65d9-11f1-938a-0a0027000009', 'ד"ר שרה גולן', 'sara.golan@clinic-app.com', '$2b$10$FxRW4OaCYc9HS6yAm0N4H.b/cHi9WYza4kp6lSJTqsr2ZMnEC0wLi', NULL, 'fbfc6d04ef3e2f23437cf02741a17dc1252dbc902cf92e9029d51b1388fe7ef2', 'doctor', '050-2000002', 1, 'Fri Jun 12 2026 00:06:04 GMT+0300 (שעון ישראל (קיץ))', 1),
(5, '5b82324c-65d9-11f1-938a-0a0027000009', 'ד"ר מיכאל אדם', 'michael.adam@clinic-app.com', '$2b$10$2e3zbkji1pg1mdxTXZFoPOkqwDGUL/uOEHGXZlfapE1aXZdN0VH22', NULL, '7ad98565d3417220a21a148921f500eeb47e30d2e00a53c8a81213cdfd837fff', 'doctor', '050-2000003', 1, 'Fri Jun 12 2026 00:06:04 GMT+0300 (שעון ישראל (קיץ))', 1),
(6, '5b826867-65d9-11f1-938a-0a0027000009', 'ד"ר אמילי טל', 'emily.tal@clinic-app.com', '$2b$10$gJGzAYibBcZuquUKMpe7Fu2HFZfLKbCNXytNEZcWmUwzOSkbIQ.He', NULL, '952972fdf45c6dfc14023dede486bd910b39f194199c40a9367deb8d38e628e4', 'doctor', '050-2000004', 1, 'Fri Jun 12 2026 00:06:04 GMT+0300 (שעון ישראל (קיץ))', 1),
(7, '5b8298f8-65d9-11f1-938a-0a0027000009', 'יעקב וילסון', 'yaakov.wilson@gmail.com', '$2b$10$pyCwnJLvajYtnbWidWA9SeCcsI4gOLyBtuHAkRGByVuFYHfCbJC0u', NULL, '36c594a65cc2c07bbbb956722858b80cd43b524a473676bde55524c563468307', 'patient', '050-3000001', 1, 'Fri Jun 12 2026 00:06:04 GMT+0300 (שעון ישראל (קיץ))', 1),
(8, '5b82d959-65d9-11f1-938a-0a0027000009', 'אמה בראון', 'emma.brown@gmail.com', '$2b$10$Y8NLLzNkKmdEQy8HsHv4g.Yh1QnBbFj1.OrJRHX2DYZLxnXjNYNey', NULL, 'dd4d4deacd86a8d797bcbf431cf6e1126bb23248c6fab767f8588f3eabdeb5d9', 'patient', '050-3000002', 1, 'Fri Jun 12 2026 00:06:04 GMT+0300 (שעון ישראל (קיץ))', 1),
(9, '5b830dea-65d9-11f1-938a-0a0027000009', 'דוד מילר', 'david.miller@gmail.com', '$2b$10$sFoDecKBCkBUDzFQNFal5e86sjQBBIhROxGW97QJK2/NRGX57mPAS', NULL, '99fa0741122360bc4d7fb09dc44d3a021607c666964e4f0ba99b971c2168d5e7', 'patient', '050-3000003', 1, 'Fri Jun 12 2026 00:06:04 GMT+0300 (שעון ישראל (קיץ))', 1),
(10, '5b833b4e-65d9-11f1-938a-0a0027000009', 'אוליביה דיוויס', 'olivia.davis@gmail.com', '$2b$10$cCQT37SVQpJzpwaC1B9gg.aQD0sxmH3KvNI8GS3pJEvbKAV415gf6', NULL, '49f4f332bdd72ee6c8172e5be1cca231a2bb751932dfeee4955caecd220a4e09', 'patient', '050-3000004', 1, 'Fri Jun 12 2026 00:06:04 GMT+0300 (שעון ישראל (קיץ))', 1),
(11, '5b836ed3-65d9-11f1-938a-0a0027000009', 'דניאל גרציה', 'daniel.garcia@gmail.com', '$2b$10$kEVxRqUDR3diIdrzDK2nj.z7z.n3rr1TCcDJ6v7t9DGhWbrzlbSgy', NULL, '605eee7997106ca00433dea9010de16204c8f7626910faa8e80aebd836cc3c7f', 'patient', '050-3000005', 1, 'Fri Jun 12 2026 00:06:04 GMT+0300 (שעון ישראל (קיץ))', 1),
(12, '5b83a5b1-65d9-11f1-938a-0a0027000009', 'סופיה מרטינז', 'sophia.martinez@gmail.com', '$2b$10$tUaERsLWw4zKYivqpL0SlO40bE.A3bxYt9DWTNIYIFTw5MHnyAs3C', NULL, 'c62767456259119c77b3f82ea32c46180118b2ec564e1e5666762c2f6a8bc3ac', 'patient', '050-3000006', 1, 'Fri Jun 12 2026 00:06:04 GMT+0300 (שעון ישראל (קיץ))', 1),
(13, '384cb644-7c43-4eca-8706-8a08876133df', 'קימל רנה', 'rinak.53023@gmail.com', '$2b$10$pH1jLebkOvckH/dN1oMaH.j/SkYR8bf7UPC735voGV4qONR12w7MK', NULL, '654da65858c284ccb0454a1583def0abb8db5070921fb741fc055ecbbd7c4dab', 'patient', '0548553023', 1, 'Sun Jun 14 2026 16:15:19 GMT+0300 (שעון ישראל (קיץ))', 1),
(14, '21cc1df7-c0be-4f6f-b1f9-47c738951e84', 'אביטל לוגסי', 'a0533153560@gmail.com', '$2b$10$8/svNKzr1DOQX1wGfxF42ed8pLvZURPWBdgOef.eyWD8jBC7bUT62', NULL, 'e1d581019e9ce0559c7a4aa4c7cfad67f7ef12c2f5de24e6fae4ced4c36ef030', 'patient', '0533153560', 1, 'Sun Jun 14 2026 16:39:28 GMT+0300 (שעון ישראל (קיץ))', 1),
(15, '5075a66d-c7a8-4299-b735-cead1dc6e4d3', 'קימל רנה', 'rina@clinic-app.com', NULL, NULL, NULL, 'doctor', '0548553023', 1, 'Sun Jun 14 2026 18:10:42 GMT+0300 (שעון ישראל (קיץ))', 0);


SET FOREIGN_KEY_CHECKS=0;
-- Truncating all tables
TRUNCATE TABLE `appointments`;
TRUNCATE TABLE `departments`;
TRUNCATE TABLE `doctor_availability`;
TRUNCATE TABLE `doctors`;
TRUNCATE TABLE `notifications`;
TRUNCATE TABLE `otps`;
TRUNCATE TABLE `patients`;
TRUNCATE TABLE `prescriptions`;
TRUNCATE TABLE `refresh_tokens`;
TRUNCATE TABLE `users`;
SET FOREIGN_KEY_CHECKS=1;
