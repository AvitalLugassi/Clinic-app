import './PatientDashboard.css';
import WelcomeBanner     from '../../components/patients/WelcomeBanner';
import ProfileSnapshot   from '../../components/patients/ProfileSnapshot';
import QuickActions      from '../../components/patients/QuickActions';
import AppointmentsList  from '../../components/patients/AppointmentsList';
import PrescriptionsList from '../../components/patients/PrescriptionsList';
import MedicalTimeline   from '../../components/patients/MedicalTimeline';
import useFetch          from '../../hooks/useFetch';
import { getMyDashboard } from '../../services/patients.service';

export default function PatientDashboard() {
  const { data, loading, error } = useFetch(getMyDashboard);

  if (loading) return <p className="patient-dashboard__status">טוען...</p>;
  if (error)   return <p className="patient-dashboard__status patient-dashboard__status--error">{error}</p>;

  const { patient, appointments, prescriptions } = data;

  const profileData = {
    name:             patient.full_name,
    idNumber:         patient.id ?? '—',
    bloodType:        patient.blood_type,
    allergies:        patient.allergies,
    phone:            patient.phone,
    address:          patient.address,
    emergencyContact: patient.emergency_contact_name,
  };

  const nextAppointment = appointments[0]
    ? {
        date:       appointments[0].scheduled_at,
        time:       new Date(appointments[0].scheduled_at).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
        doctorName: appointments[0].doctor_name,
        department: appointments[0].department,
      }
    : null;

  const apptList = appointments.map((a) => ({
    id:         a.id,
    date:       a.scheduled_at,
    time:       new Date(a.scheduled_at).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
    doctorName: a.doctor_name,
    department: a.department,
    status:     a.status,
  }));

  const rxList = prescriptions.map((p) => ({
    id:         p.id,
    medication: p.medications,
    dosage:     p.dosage,
    expiresAt:  p.valid_until,
  }));

  return (
    <div className="patient-dashboard">
      <WelcomeBanner nextAppointment={nextAppointment} />

      <div className="patient-dashboard__main">
        <div className="patient-dashboard__center">
          <QuickActions />
          <AppointmentsList appointments={apptList} />
          <div className="patient-dashboard__bottom-row">
            <PrescriptionsList prescriptions={rxList} />
            <MedicalTimeline events={[]} />
          </div>
        </div>

        <ProfileSnapshot patient={profileData} />
      </div>
    </div>
  );
}
