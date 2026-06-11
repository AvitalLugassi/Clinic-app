import { getPatientDashboard } from '../models/Patient.js';

export const getMyDashboard = async (req, res) => {
  try {
    const data = await getPatientDashboard(req.user.id);
    if (!data.patient) return res.status(404).json({ message: 'Patient not found' });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
