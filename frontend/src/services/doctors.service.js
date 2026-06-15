import api from './api';

/**
 * שליפת כל המחלקות הקיימות במרפאה
 */
export const getDepartments = async () => {
  const response = await api.get('/departments');
  return response.data;
};

/**
 * שליפת רופאים השייכים למחלקה ספציפית
 * @param {number} departmentId - מזהה המחלקה ב-SQL
 */
export const getDoctorsByDepartment = async (departmentId) => {
  const response = await api.get(`/doctors`, {
    params: { department_id: departmentId }
  });
  return response.data;
};

/**
 * שליפת הפרופיל המלא ופרטי ההתקשרות של רופא ספציפי
 * @param {number} id - מזהה הרופא
 */
export const getDoctorById = async (id) => {
  const response = await api.get(`/doctors/${id}`);
  return response.data;
};

/**
 * שליפת כל הרופאים במערכת (למשל עבור מסך חיפוש כללי או אדמין)
 * @param {Object} filters - מסננים אופציונליים כמו שם או התמחות
 */
export const getAllDoctors = async (filters = {}) => {
  const response = await api.get('/doctors/all', { params: filters });
  return response.data;
};