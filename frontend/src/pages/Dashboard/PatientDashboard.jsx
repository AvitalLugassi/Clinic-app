import StatsGrid from '../../components/ui/StatsGrid/StatsGrid';
import WelcomeBanner from '../../components/patients/WelcomeBanner';
import QuickActions from '../../components/patients/QuickActions';
import AppointmentsList from '../../components/patients/AppointmentsList';
import PrescriptionsList from '../../components/patients/PrescriptionsList';
import MedicalTimeline from '../../components/patients/MedicalTimeline';
import ProfileSnapshot from '../../components/patients/ProfileSnapshot';
import './PatientDashboard.css';

// ─── Mock data (יוחלף בקריאות API אמיתיות) ───────────────────────────────────

const MOCK_PATIENT = {
  name: 'אביטל לוגסי',
  idNumber: '123456789',
  bloodType: 'O+',
  allergies: 'Penicillin',
  phone: '050-1234567',
  emergencyContact: 'יוסי לוגסי',
  address: 'תל אביב',
};

const MOCK_NEXT_APPT = {
  doctorName: 'ד"ר כהן',
  department: 'קרדיולוגיה',
  date: '2026-06-14',
  time: '10:30',
};

const MOCK_APPOINTMENTS = [
  { id: 1, date: '2026-06-14', time: '10:30', doctorName: 'ד"ר כהן',  department: 'קרדיולוגיה', status: 'confirmed' },
  { id: 2, date: '2026-06-21', time: '15:00', doctorName: 'ד"ר לוי',  department: 'עור',         status: 'pending'   },
  { id: 3, date: '2026-07-03', time: '09:00', doctorName: 'ד"ר מזרחי', department: 'אורתופדיה',  status: 'confirmed' },
];

const MOCK_PRESCRIPTIONS = [
  { id: 1, medication: 'Paracetamol', dosage: '500mg · פעמיים ביום', expiresAt: '2026-07-15' },
  { id: 2, medication: 'Ibuprofen',   dosage: '400mg · לפי הצורך',   expiresAt: '2026-08-01' },
  { id: 3, medication: 'Amoxicillin', dosage: '250mg · שלוש פעמים',  expiresAt: '2026-06-18' },
];

const MOCK_TIMELINE = [
  { type: 'appointment',  description: 'ביקור אצל ד"ר כהן — קרדיולוגיה',  date: '2026-06-05' },
  { type: 'file',         description: 'הועלה צילום MRI עמוד שדרה',         date: '2026-06-01' },
  { type: 'prescription', description: 'נוצר מרשם חדש — Paracetamol',       date: '2026-05-28' },
  { type: 'record',       description: 'נוצרה רשומה רפואית חדשה',            date: '2026-05-20' },
];

const STATS_CARDS = [
  { icon: '📅', label: 'תורים קרובים',    value: MOCK_APPOINTMENTS.length },
  { icon: '💊', label: 'מרשמים פעילים',   value: MOCK_PRESCRIPTIONS.length },
  { icon: '📄', label: 'מסמכים רפואיים',  value: 12 },
  { icon: '🔔', label: 'התראות חדשות',    value: 2  },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function PatientDashboard() {
  return (
    <div className="patient-dashboard">

      <WelcomeBanner nextAppointment={MOCK_NEXT_APPT} />

      <StatsGrid cards={STATS_CARDS} />

      <QuickActions />

      <div className="patient-dashboard__main">
        <div className="patient-dashboard__center">
          <AppointmentsList appointments={MOCK_APPOINTMENTS} />
          <div className="patient-dashboard__bottom-row">
            <PrescriptionsList prescriptions={MOCK_PRESCRIPTIONS} />
            <MedicalTimeline events={MOCK_TIMELINE} />
          </div>
        </div>

        <ProfileSnapshot patient={MOCK_PATIENT} />
      </div>

    </div>
  );
}
