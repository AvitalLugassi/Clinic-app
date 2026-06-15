import { useAuthContext } from '../../context/AuthContext';
import './WelcomeBanner.css';

export default function WelcomeBanner({ nextAppointment }) {
  const { user } = useAuthContext();

  const today = new Date().toLocaleDateString('he-IL', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const daysUntil = nextAppointment
    ? Math.ceil((new Date(nextAppointment.date) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="welcome-banner">
      <div className="welcome-banner__text">
        <h1 className="welcome-banner__greeting">שלום, {user?.name ?? 'מטופל'} 👋</h1>
        <p className="welcome-banner__sub">ברוכה הבאה ל־MediFlow</p>
        <span className="welcome-banner__date">{today}</span>
      </div>

      {nextAppointment && (
        <div className="welcome-banner__next-appt">
          <span className="welcome-banner__next-appt-icon">🩺</span>
          <div>
            <p className="welcome-banner__next-appt-label">התור הקרוב שלך</p>
            <p className="welcome-banner__next-appt-doctor">{nextAppointment.doctorName}</p>
            <p className="welcome-banner__next-appt-detail">
              {new Date(nextAppointment.date).toLocaleDateString('he-IL')} &nbsp;|&nbsp;
              {nextAppointment.time} &nbsp;|&nbsp; {nextAppointment.department}
            </p>
            {daysUntil !== null && (
              <span className="welcome-banner__next-appt-badge">
                {daysUntil === 0 ? 'היום!' : daysUntil === 1 ? 'מחר' : `בעוד ${daysUntil} ימים`}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}