import { fetchDoctorDashboard, fetchAllDoctors } from '../services/doctors.service.js';

export const getMyDashboard = async (req, res) => {
  try {
    const data = await fetchDoctorDashboard(req.user.id);
    if (!data.doctor) return res.status(404).json({ message: 'רופא לא נמצא' });
    res.json(data);
  } catch (err) {
    console.error('Error in getMyDashboard (doctor):', err);
    res.status(500).json({ message: 'שגיאה פנימית בשרת' });
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await fetchAllDoctors();
    res.json(doctors);
  } catch (err) {
    console.error('Error in getAllDoctors:', err);
    res.status(500).json({ message: 'שגיאה בשליפת רשימת הרופאים' });
  }
};
