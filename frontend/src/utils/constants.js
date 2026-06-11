export const ROLES = { ADMIN: 'admin', DOCTOR: 'doctor', PATIENT: 'patient' };

export const APPOINTMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

export const API_BASE = import.meta.env.VITE_API_BASE;
