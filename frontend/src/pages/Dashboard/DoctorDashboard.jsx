import StatsGrid from '../../components/ui/StatsGrid/StatsGrid';

const cards = [
  { icon: '📅', label: "Today's Appointments", value: null },
  { icon: '🧑⚕️', label: 'My Patients', value: null },
  { icon: '💊', label: 'Pending Prescriptions', value: null },
  { icon: '📋', label: 'New Records', value: null },
];

export default function DoctorDashboard() {
  return <StatsGrid title="Doctor Dashboard" cards={cards} />;
}
