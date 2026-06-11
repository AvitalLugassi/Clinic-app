import StatsGrid from '../../components/ui/StatsGrid/StatsGrid';

const cards = [
  { icon: '📅', label: 'Next Appointment', value: null },
  { icon: '👨⚕️', label: 'My Doctors', value: null },
  { icon: '💊', label: 'Active Prescriptions', value: null },
  { icon: '📋', label: 'Medical Records', value: null },
];

export default function PatientDashboard() {
  return <StatsGrid title="Patient Dashboard" cards={cards} />;
}
