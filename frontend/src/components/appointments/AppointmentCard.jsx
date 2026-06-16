import { useState } from 'react';
import StatusBadge from './StatusBadge';
import PrescriptionForm from '../prescriptions/PrescriptionForm';
import './AppointmentCard.css';
import { useAuthContext } from '../../context/AuthContext';

function buildGoogleCalendarUrl(appt) {
  const start = new Date(appt.scheduled_at);
  const end = new Date(start.getTime() + 30 * 60000);
  const fmt = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `תור אצל ${appt.doctor_name}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: appt.department,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

export default function AppointmentCard({ appointment, onCancel }) {
  const { user } = useAuthContext();
  const [showRx, setShowRx] = useState(false);
  const { id, doctor_name, doctor_id, department, scheduled_at, status, patient_id } = appointment;

  const date = new Date(scheduled_at);
  const dateStr = date.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });

  const isFuture = date > new Date();
  const canCancel = isFuture && (status === 'confirmed' || status === 'pending');

  return (
    <div className="appt-card">
      <div className="appt-card__header">
        <img
          src={`https://i.pravatar.cc/150?img=${doctor_id ?? 10}`}
          alt={doctor_name}
          className="appt-card__avatar"
        />
        <div className="appt-card__doctor-info">
          <span className="appt-card__doctor-name">ד"ר {doctor_name}</span>
          <span className="appt-card__department">{department}</span>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="appt-card__body">
        <span className="appt-card__icon">📅</span>
        <span>{dateStr}</span>
        <span className="appt-card__sep">|</span>
        <span className="appt-card__icon">🕐</span>
        <span>{timeStr}</span>
      </div>

      <div className="appt-card__actions">
        {canCancel && (
          <button className="appt-card__btn appt-card__btn--cancel" onClick={() => onCancel(id)}>
            ביטול תור
          </button>
        )}
        {user?.role === 'doctor' && (
          <button className="appt-card__btn" onClick={() => setShowRx((v) => !v)}>
            💊 {showRx ? 'סגור מרשם' : 'כתוב מרשם'}
          </button>
        )}
        {isFuture && (
          <a
            href={buildGoogleCalendarUrl(appointment)}
            target="_blank"
            rel="noreferrer"
            className="appt-card__btn appt-card__btn--calendar"
          >
            📆 הוסף ליומן
          </a>
        )}
      </div>
      {showRx && (
        <PrescriptionForm
          patientId={patient_id}
          onClose={() => setShowRx(false)}
        />
      )}
    </div>
  );
}
