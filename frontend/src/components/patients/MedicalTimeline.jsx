import './MedicalTimeline.css';

const TYPE_CONFIG = {
  appointment:  { icon: '🩺', label: 'ביקור'         },
  prescription: { icon: '💊', label: 'מרשם'          },
  record:       { icon: '📋', label: 'רשומה רפואית'  },
  file:         { icon: '📄', label: 'מסמך'          },
};

export default function MedicalTimeline({ events = [] }) {
  return (
    <section className="timeline">
      <h2 className="timeline__title">📅 ציר זמן רפואי</h2>

      {events.length === 0 ? (
        <p className="timeline__empty">אין אירועים להצגה</p>
      ) : (
        <ol className="timeline__list">
          {events.map((event, i) => {
            const config = TYPE_CONFIG[event.type] ?? { icon: '📌', label: event.type };
            return (
              <li key={i} className="timeline__item">
                <div className="timeline__dot">{config.icon}</div>
                <div className="timeline__content">
                  <span className="timeline__item-type">{config.label}</span>
                  <p className="timeline__item-desc">{event.description}</p>
                  <time className="timeline__item-date">
                    {new Date(event.date).toLocaleDateString('he-IL', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </time>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
