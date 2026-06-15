import { useState } from 'react';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import BookingWizard   from '../../components/appointments/BookingWizard';
import './AppointmentCalendar.css';

// Mock data - יוחלף בקריאות שרת
const MOCK_APPOINTMENTS = [
  { id: 1, doctor_name: 'כהן אבי',   doctor_id: 1, department: 'קרדיולוגיה', scheduled_at: new Date(Date.now() + 2  * 86400000).toISOString(), status: 'confirmed' },
  { id: 2, doctor_name: 'לוי מרים',  doctor_id: 2, department: 'עיניים',      scheduled_at: new Date(Date.now() + 7  * 86400000).toISOString(), status: 'pending'   },
  { id: 3, doctor_name: 'גולד יוסף', doctor_id: 3, department: 'עצמות',       scheduled_at: new Date(Date.now() - 5  * 86400000).toISOString(), status: 'completed' },
  { id: 4, doctor_name: 'ברק שרה',   doctor_id: 4, department: 'עור',         scheduled_at: new Date(Date.now() - 10 * 86400000).toISOString(), status: 'cancelled' },
];

const TABS = ['תורים עתידיים', 'היסטוריה', 'בקשות ממתינות'];

export default function AppointmentCalendar() {
  const [tab, setTab]               = useState(0);
  const [showWizard, setShowWizard] = useState(false);
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);

  const now = new Date();

  const future  = appointments.filter((a) => new Date(a.scheduled_at) > now && (a.status === 'confirmed' || a.status === 'pending'));
  const history = appointments.filter((a) => a.status === 'completed' || a.status === 'cancelled');
  const pending = appointments.filter((a) => a.status === 'pending');

  const lists = [future, history, pending];

  const handleCancel = (id) =>
    setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: 'cancelled' } : a));

  const handleBook = (booking) => {
    const newAppt = {
      id:           Date.now(),
      doctor_name:  booking.doctor.name,
      doctor_id:    booking.doctor.id,
      department:   booking.doctor.department,
      scheduled_at: new Date().toISOString(), // בפועל יחושב לפי day + time
      status:       'pending',
    };
    setAppointments((prev) => [newAppt, ...prev]);
    setShowWizard(false);
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
        {lists[tab].length === 0 ? (
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
