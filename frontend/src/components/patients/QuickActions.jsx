import { useNavigate } from 'react-router-dom';
import './QuickActions.css';

const ACTIONS = [
  { icon: '🗓', label: 'קביעת תור',      path: '/appointments/book' },
  { icon: '👨‍⚕️', label: 'מציאת רופא',    path: '/doctors'           },
  { icon: '📤', label: 'העלאת מסמך',    path: '/records'           },
  { icon: '📋', label: 'התיק הרפואי',   path: '/records'           },
  { icon: '💊', label: 'מרשמים',        path: '/prescriptions'     },
  { icon: '💬', label: 'הודעות',        path: '/messages'          },
];

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <section className="quick-actions">
      <h2 className="quick-actions__title">פעולות מהירות</h2>
      <div className="quick-actions__grid">
        {ACTIONS.map(({ icon, label, path }) => (
          <button key={label} className="quick-actions__btn" onClick={() => navigate(path)}>
            <span className="quick-actions__btn-icon">{icon}</span>
            <span className="quick-actions__btn-label">{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
