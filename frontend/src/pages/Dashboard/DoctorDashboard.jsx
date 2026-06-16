import { useState, useEffect } from 'react';
import StatsGrid from '../../components/ui/StatsGrid/StatsGrid';
import useAuth from '../../hooks/useAuth';
import * as appointmentsService from '../../services/appointments.service';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    pendingPrescriptions: 0,
    newRecords: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorStats = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        
        // הביא את התורים של הרופא
        const appointments = await appointmentsService.getAppointmentsByDoctor(user.id);
        
        // קבל את התאריך של היום
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // מיד תורים של היום
        const todayAppointments = appointments.filter(apt => {
          const aptDate = new Date(apt.scheduled_at);
          aptDate.setHours(0, 0, 0, 0);
          return aptDate.getTime() === today.getTime();
        }).length;

        // מיד מטופלים ייחודיים (כרגע - מה שעל תורים)
        const uniquePatients = new Set(appointments.map(apt => apt.patient_name)).size;

        setStats({
          todayAppointments,
          totalPatients: uniquePatients,
          pendingPrescriptions: 0, // עדיין לא מטופל
          newRecords: 0, // עדיין לא מטופל
        });
      } catch (err) {
        console.error('Error fetching doctor stats:', err);
        setError(err.message || 'שגיאה בשליפת תורי הרופא');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorStats();
  }, [user?.id]);

  const cards = [
    { icon: '📅', label: "Today's Appointments", value: loading ? '--' : stats.todayAppointments },
    { icon: '🧑⚕️', label: 'My Patients', value: loading ? '--' : stats.totalPatients },
    { icon: '💊', label: 'Pending Prescriptions', value: loading ? '--' : stats.pendingPrescriptions },
    { icon: '📋', label: 'New Records', value: loading ? '--' : stats.newRecords },
  ];

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        ⚠️ {error}
      </div>
    );
  }

  return <StatsGrid title="Doctor Dashboard" cards={cards} />;
}
