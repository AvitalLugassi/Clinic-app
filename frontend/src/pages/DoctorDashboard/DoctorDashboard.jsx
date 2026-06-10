import Dashboard from '../../components/ui/Dashboard/Dashboard';

const cards = [
  { icon: '📅', label: "Today's Appointments", value: null },
  { icon: '🧑⚕️', label: 'My Patients', value: null },
  { icon: '💊', label: 'Pending Prescriptions', value: null },
  { icon: '📋', label: 'New Records', value: null },
];

export default function DoctorDashboard() {
  return <Dashboard title="Doctor Dashboard" cards={cards} />;
}
