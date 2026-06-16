import { fetchPatientDashboard } from '../services/patients.service.js';

export const getMyDashboard = async (req, res) => {
  try {
    const data = await fetchPatientDashboard(req.user.id);
    if (!data.patient) return res.status(404).json({ message: 'מטופל לא נמצא' });
    res.json(data);
  } catch (err) {
    console.error('Error in getMyDashboard:', err);
    res.status(500).json({ message: 'שגיאה פנימית בשרת' });
  }
};
