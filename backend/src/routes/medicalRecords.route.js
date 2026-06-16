import express from 'express';
import * as medicalRecordsController from '../controllers/medicalRecords.controller.js';

const router = express.Router();

router.post('/', medicalRecordsController.createMedicalRecord);
router.get('/patient/:patient_id', medicalRecordsController.getPatientMedicalHistory);

export default router;