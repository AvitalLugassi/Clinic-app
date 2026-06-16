import { createPrescription, getPatientPrescriptions, getPrescriptionsByPatientId } from '../models/Prescription.models.js';

export const addPrescription = async (req, res) => {
  try {
    const { patient_id, medications, dosage, instructions, valid_until } = req.body;
    const doctor_id = req.user.id;
    const id = await createPrescription({ doctor_id, patient_id, medications, dosage, instructions, valid_until });
    res.status(201).json({ id });
  } catch (err) {
    console.error('Error in addPrescription:', err);
    res.status(500).json({ message: 'שגיאה פנימית בשרת' });
  }
};

export const getMyPrescriptions = async (req, res) => {
  try {
    // allow staff/doctors to pass ?patient_id= to view a specific patient's prescriptions
    const { patient_id } = req.query;
    const data = patient_id && (req.user.role === 'staff' || req.user.role === 'doctor')
      ? await getPrescriptionsByPatientId(patient_id)
      : await getPatientPrescriptions(req.user.id);
    res.json(data);
  } catch (err) {
    console.error('Error in getMyPrescriptions:', err);
    res.status(500).json({ message: 'שגיאה פנימית בשרת' });
  }
};
