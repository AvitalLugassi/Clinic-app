import StatsGrid from '../../components/ui/StatsGrid/StatsGrid';

const cards = [
  { icon: '🧑‍⚕️', label: 'Total Patients', value: null },
  { icon: '👨‍⚕️', label: 'Total Doctors', value: null },
  { icon: '📅', label: 'Appointments Today', value: null },
  { icon: '📈', label: 'Pending Reports', value: null },
];

export default function AdminDashboard() {
  return <StatsGrid title="Admin Dashboard" cards={cards} />;
}
