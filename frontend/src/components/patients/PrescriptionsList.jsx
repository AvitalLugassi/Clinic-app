import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button/Button';
import './PrescriptionsList.css';

export default function PrescriptionsList({ prescriptions = [] }) {
  const navigate = useNavigate();

  return (
    <section className="rx-list">
      <div className="rx-list__header">
        <h2 className="rx-list__title">💊 מרשמים פעילים</h2>
        <Button variant="ghost" size="sm" onClick={() => navigate('/prescriptions')}>
          כל המרשמים ←
        </Button>
      </div>

      {prescriptions.length === 0 ? (
        <p className="rx-list__empty">אין מרשמים פעילים</p>
      ) : (
        <ul className="rx-list__items">
          {prescriptions.map((rx) => {
            const expDate = new Date(rx.expiresAt);
            const daysLeft = Math.ceil((expDate - new Date()) / (1000 * 60 * 60 * 24));
            const isExpiringSoon = daysLeft <= 7;

            return (
              <li key={rx.id} className="rx-list__item">
                <div className="rx-list__item-info">
                  <span className="rx-list__item-name">{rx.medication}</span>
                  <span className="rx-list__item-dosage">{rx.dosage}</span>
                </div>
                <span className={`rx-list__item-exp ${isExpiringSoon ? 'rx-list__item-exp--soon' : ''}`}>
                  {isExpiringSoon ? '⚠️ ' : ''}
                  בתוקף עד {expDate.toLocaleDateString('he-IL')}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
