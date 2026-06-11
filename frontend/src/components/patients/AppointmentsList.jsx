import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button/Button';
import './AppointmentsList.css';

const STATUS_LABEL = {
  confirmed: { text: 'מאושר',  cls: 'confirmed'  },
  pending:   { text: 'ממתין',  cls: 'pending'    },
  cancelled: { text: 'בוטל',   cls: 'cancelled'  },
};

export default function AppointmentsList({ appointments = [] }) {
  const navigate = useNavigate();

  return (
    <section className="appts-list">
      <div className="appts-list__header">
        <h2 className="appts-list__title">התורים הקרובים</h2>
        <Button variant="ghost" size="sm" onClick={() => navigate('/appointments')}>
          צפה בכל התורים ←
        </Button>
      </div>

      {appointments.length === 0 ? (
        <p className="appts-list__empty">אין תורים קרובים</p>
      ) : (
        <table className="appts-list__table">
          <thead>
            <tr>
              <th>תאריך</th>
              <th>שעה</th>
              <th>רופא</th>
              <th>מחלקה</th>
              <th>סטטוס</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => {
              const status = STATUS_LABEL[appt.status] ?? { text: appt.status, cls: 'pending' };
              return (
                <tr key={appt.id}>
                  <td>{new Date(appt.date).toLocaleDateString('he-IL')}</td>
                  <td>{appt.time}</td>
                  <td>{appt.doctorName}</td>
                  <td>{appt.department}</td>
                  <td>
                    <span className={`appts-list__badge appts-list__badge--${status.cls}`}>
                      {status.text}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}
