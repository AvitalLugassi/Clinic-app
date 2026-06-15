import { useState } from 'react';
import './BookingWizard.css';

const MOCK_DEPARTMENTS = ['קרדיולוגיה', 'עצמות', 'עיניים', 'עור', 'ילדים', 'נוירולוגיה'];

const MOCK_DOCTORS = [
  { id: 1,  name: 'כהן אבי',      department: 'קרדיולוגיה', available_days: ['ראשון','שלישי','חמישי'], session_duration_min: 20 },
  { id: 2,  name: 'לוי מרים',     department: 'עיניים',      available_days: ['שני','רביעי'],           session_duration_min: 15 },
  { id: 3,  name: 'גולד יוסף',    department: 'עצמות',       available_days: ['ראשון','רביעי'],         session_duration_min: 30 },
  { id: 4,  name: 'ברק שרה',      department: 'עור',         available_days: ['שני','חמישי'],           session_duration_min: 20 },
  { id: 5,  name: 'מזרחי דוד',    department: 'ילדים',       available_days: ['ראשון','שני','שלישי'],   session_duration_min: 15 },
  { id: 6,  name: 'פרץ נועה',     department: 'נוירולוגיה',  available_days: ['שלישי','חמישי'],         session_duration_min: 40 },
];

const WORK_START = 8 * 60;
const WORK_END   = 17 * 60;

// תורים תפוסים לדוגמה (בפועל יגיע מהשרת)
const MOCK_BOOKED = {
  1: ['09:00', '09:40'],
  2: ['10:00'],
};

function generateSlots(durationMin, bookedSlots = []) {
  const slots = [];
  for (let t = WORK_START; t + durationMin <= WORK_END; t += durationMin) {
    const h = String(Math.floor(t / 60)).padStart(2, '0');
    const m = String(t % 60).padStart(2, '0');
    const label = `${h}:${m}`;
    slots.push({ label, available: !bookedSlots.includes(label) });
  }
  return slots;
}

const STEPS = ['בחירת מחלקה / רופא', 'בחירת יום', 'בחירת שעה'];

export default function BookingWizard({ onBook, onClose }) {
  const [step, setStep]               = useState(0);
  const [search, setSearch]           = useState('');
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const filteredDoctors = MOCK_DOCTORS.filter((d) => {
    if (search) return d.name.includes(search) || d.department.includes(search);
    if (selectedDept) return d.department === selectedDept;
    return true;
  });

  const slots = selectedDoctor
    ? generateSlots(selectedDoctor.session_duration_min, MOCK_BOOKED[selectedDoctor.id] ?? [])
    : [];

  const handleBook = () => {
    onBook?.({ doctor: selectedDoctor, day: selectedDay, time: selectedSlot });

    // כאן לעשות קריאה לשרת עם הפרטים שנבחרו, ולטפל בתוצאה (הצלחה/שגיאה)
  };

  return (
    <div className="wizard">
      {/* Progress */}
      <div className="wizard__steps">
        {STEPS.map((label, i) => (
          <div key={i} className={`wizard__step ${i === step ? 'wizard__step--active' : ''} ${i < step ? 'wizard__step--done' : ''}`}>
            <div className="wizard__step-circle">{i < step ? '✓' : i + 1}</div>
            <span className="wizard__step-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="wizard__body">

        {/* שלב 1 */}
        {step === 0 && (
          <div className="wizard__panel">
            <input
              className="wizard__search"
              placeholder="חפש רופא או מחלקה..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSelectedDept(null); }}
            />

            {!search && (
              <div className="wizard__dept-grid">
                {MOCK_DEPARTMENTS.map((d) => (
                  <button
                    key={d}
                    className={`wizard__dept-btn ${selectedDept === d ? 'wizard__dept-btn--active' : ''}`}
                    onClick={() => { setSelectedDept(d === selectedDept ? null : d); }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            )}

            <div className="wizard__doctor-list">
              {filteredDoctors.map((doc) => (
                <button
                  key={doc.id}
                  className={`wizard__doctor-card ${selectedDoctor?.id === doc.id ? 'wizard__doctor-card--active' : ''}`}
                  onClick={() => setSelectedDoctor(doc)}
                >
                  <img src={`https://i.pravatar.cc/150?img=${doc.id}`} alt={doc.name} className="wizard__doctor-avatar" />
                  <div>
                    <div className="wizard__doctor-name">ד"ר {doc.name}</div>
                    <div className="wizard__doctor-dept">{doc.department}</div>
                  </div>
                  {selectedDoctor?.id === doc.id && <span className="wizard__check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* שלב 2 */}
        {step === 1 && selectedDoctor && (
          <div className="wizard__panel">
            <p className="wizard__subtitle">ימי זמינות של ד"ר {selectedDoctor.name}</p>
            <div className="wizard__days">
              {selectedDoctor.available_days.map((day) => (
                <button
                  key={day}
                  className={`wizard__day-btn ${selectedDay === day ? 'wizard__day-btn--active' : ''}`}
                  onClick={() => setSelectedDay(day)}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* שלב 3 */}
        {step === 2 && selectedDoctor && (
          <div className="wizard__panel">
            <p className="wizard__subtitle">שעות פנויות — {selectedDay}</p>
            <div className="wizard__slots">
              {slots.map(({ label, available }) => (
                <button
                  key={label}
                  disabled={!available}
                  className={`wizard__slot ${!available ? 'wizard__slot--taken' : ''} ${selectedSlot === label ? 'wizard__slot--active' : ''}`}
                  onClick={() => available && setSelectedSlot(label)}
                >
                  {label}
                  {!available && <span className="wizard__slot-taken-label">תפוס</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="wizard__footer">
        {onClose && <button className="wizard__btn wizard__btn--ghost" onClick={onClose}>ביטול</button>}
        {step > 0 && (
          <button className="wizard__btn wizard__btn--ghost" onClick={() => setStep(step - 1)}>חזור</button>
        )}
        {step < 2 && (
          <button
            className="wizard__btn wizard__btn--primary"
            disabled={step === 0 ? !selectedDoctor : !selectedDay}
            onClick={() => setStep(step + 1)}
          >
            המשך
          </button>
        )}
        {step === 2 && (
          <button
            className="wizard__btn wizard__btn--primary"
            disabled={!selectedSlot}
            onClick={handleBook}
          >
            קביעת תור ✓
          </button>
        )}
      </div>
    </div>
  );
}
