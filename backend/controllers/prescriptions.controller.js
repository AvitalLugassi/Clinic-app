import { getPatientPrescriptions } from '../models/Prescription.js';

export const getMyPrescriptions = async (req, res) => {
  try {
    const data = await getPatientPrescriptions(req.user.id);
    res.json(data);
  } catch (err) {
    console.error('Error in getMyPrescriptions:', err);
    res.status(500).json({ message: 'שגיאה פנימית בשרת' });
  }
};
