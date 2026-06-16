import { useState, useEffect } from 'react';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import BookingWizard   from '../../components/appointments/BookingWizard';
import './AppointmentCalendar.css';
import { useAuthContext } from '../../context/AuthContext';
import useFetch from '../../hooks/useFetch';
import { getPatientAppointments, getAppointmentsByDoctor, updateAppointmentStatus } from '../../services/appointments.service';

const TABS = ['תורים עתידיים', 'היסטוריה', 'בקשות ממתינות'];

export default function AppointmentCalendar() {
  const { user } = useAuthContext();
  const [tab, setTab]               = useState(0);
  const [showWizard, setShowWizard] = useState(false);
  const [appointments, setAppointments] = useState([]);

  const { data, loading, error, refetch } = useFetch(
    () => {
      if (!user) return Promise.resolve([]);
      return user.role === 'doctor' ? getAppointmentsByDoctor(user.id) : getPatientAppointments(user.id);
    },
    [user]
  );

  useEffect(() => {
    if (data) setAppointments(data);
  }, [data]);

  const now = new Date();

  const future  = appointments.filter((a) => new Date(a.scheduled_at) > now && (a.status === 'confirmed' || a.status === 'pending'));
  const history = appointments.filter((a) => a.status === 'completed' || a.status === 'cancelled');
  const pending = appointments.filter((a) => a.status === 'pending');

  const lists = [future, history, pending];

  const handleCancel = async (id) => {
    try {
      await updateAppointmentStatus(id, 'cancelled');
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a)));
    } catch (err) {
      console.error('Cancel appointment failed', err);
    }
  };

  const handleBook = () => {
    setShowWizard(false);
    refetch();
  };

  return (
    <div className="appt-calendar">
      <div className="appt-calendar__header">
        <div>
          <h1 className="appt-calendar__title">התורים שלי</h1>
          <p className="appt-calendar__subtitle">{future.length} תורים קרובים</p>
        </div>
        <button className="appt-calendar__new-btn" onClick={() => setShowWizard(!showWizard)}>
          {showWizard ? '✕ סגור' : '＋ קביעת תור חדש'}
        </button>
      </div>

      {showWizard && (
        <div className="appt-calendar__wizard-wrap">
          <BookingWizard onBook={handleBook} onClose={() => setShowWizard(false)} />
        </div>
      )}

      <div className="appt-calendar__tabs">
        {TABS.map((label, i) => (
          <button
            key={i}
            className={`appt-calendar__tab ${tab === i ? 'appt-calendar__tab--active' : ''}`}
            onClick={() => setTab(i)}
          >
            {label}
            <span className="appt-calendar__tab-count">{lists[i].length}</span>
          </button>
        ))}
      </div>

      <div className="appt-calendar__list">
        {loading ? (
          <div className="appt-calendar__empty">
            <span>⏳</span>
            <p>טוען תורים...</p>
          </div>
        ) : error ? (
          <div className="appt-calendar__empty">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        ) : lists[tab].length === 0 ? (
          <div className="appt-calendar__empty">
            <span>📭</span>
            <p>אין תורים להצגה</p>
          </div>
        ) : (
          lists[tab].map((appt) => (
            <AppointmentCard key={appt.id} appointment={appt} onCancel={handleCancel} />
          ))
        )}
      </div>
    </div>
  );
}
