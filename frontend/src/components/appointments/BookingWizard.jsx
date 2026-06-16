import { useState, useEffect } from 'react';
import { getAllDoctors } from '../../services/doctors.service';
import { getDoctorAvailability, createAppointment } from '../../services/appointments.service';
import { useAuthContext } from '../../context/AuthContext';
import './BookingWizard.css';

const STEPS = ['בחירת רופא', 'בחירת תאריך', 'בחירת שעה'];

function getNext14Days() {
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d.toISOString().split('T')[0];
  });
}

export default function BookingWizard({ onBook, onClose }) {
  const { user } = useAuthContext();
  const [step, setStep] = useState(0);
  const [search, setSearch] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [adminPatientId, setAdminPatientId] = useState('');

  useEffect(() => {
    getAllDoctors()
      .then(setDoctors)
      .catch(() => setError('שגיאה בטעינת הרופאים'))
      .finally(() => setLoadingDoctors(false));
  }, []);

  // Prevent doctors from booking — they should only view appointments
  useEffect(() => {
    if (user?.role === 'doctor') {
      setError('רופאים אינם מורשים לקבוע תורים');
    }
  }, [user]);

  useEffect(() => {
    if (!selectedDoctor || !selectedDate) return;
    setLoadingSlots(true);
    setSelectedSlot(null);
    getDoctorAvailability(selectedDoctor.id, selectedDate)
      .then(setSlots)
      .catch(() => setError('שגיאה בטעינת השעות'))
      .finally(() => setLoadingSlots(false));
  }, [selectedDoctor, selectedDate]);

  const departments = [...new Set(doctors.map((d) => d.department).filter(Boolean))];

  const filteredDoctors = doctors.filter((d) => {
    if (search) return d.full_name.includes(search) || d.department?.includes(search);
    if (selectedDept) return d.department === selectedDept;
    return true;
  });

  const handleBook = async () => {
    setError('');
    setSubmitting(true);
    try {
      const scheduled_at = `${selectedDate} ${selectedSlot}:00`;
      let patient_id = user.id;
      if (user.role === 'admin') {
        if (!adminPatientId) throw new Error('יש להזין מזהה מטופל');
        patient_id = Number(adminPatientId);
      }
      await createAppointment({ patient_id, doctor_id: selectedDoctor.id, scheduled_at });
      onBook?.();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'שגיאה בקביעת התור');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="wizard">
      <div className="wizard__steps">
        {STEPS.map((label, i) => (
          <div key={i} className={`wizard__step ${i === step ? 'wizard__step--active' : ''} ${i < step ? 'wizard__step--done' : ''}`}>
            <div className="wizard__step-circle">{i < step ? '✓' : i + 1}</div>
            <span className="wizard__step-label">{label}</span>
          </div>
        ))}
      </div>

      <div className="wizard__body">
        {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', margin: '0 0 0.75rem' }}>{error}</p>}

        {step === 0 && (
          <div className="wizard__panel">
            <p className="wizard__subtitle">בחר רופא</p>
              {user?.role === 'admin' && (
              <div style={{ margin: '0.5rem 0' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>מזהה מטופל (ID)</label>
                <input value={adminPatientId} onChange={(e) => setAdminPatientId(e.target.value)} placeholder="הכנס מזהה מספרי" />
              </div>
            )}

            <div className="wizard__search" style={{ margin: '0.5rem 0' }}>
              <input
                placeholder="חפש רופא או מחלקה..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSelectedDept(null); }}
              />
            </div>

            {!search && (
              <div className="wizard__dept-grid">
                {departments.map((d) => (
                  <button
                    key={d}
                    className={`wizard__dept-btn ${selectedDept === d ? 'wizard__dept-btn--active' : ''}`}
                    onClick={() => setSelectedDept(d === selectedDept ? null : d)}
                  >{d}</button>
                ))}
              </div>
            )}

            {loadingDoctors ? (
              <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>טוען רופאים...</p>
            ) : filteredDoctors.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>
                {doctors.length === 0 ? 'לא נמצאו רופאים במערכת' : 'לא נמצאו תוצאות לחיפוש'}
              </p>
            ) : (
              <div className="wizard__doctor-list">
                {filteredDoctors.map((doc) => (
                  <button
                    key={doc.id}
                    className={`wizard__doctor-card ${selectedDoctor?.id === doc.id ? 'wizard__doctor-card--active' : ''}`}
                    onClick={() => setSelectedDoctor(doc)}
                  >
                    <img src={`https://i.pravatar.cc/150?img=${doc.id}`} alt={doc.full_name} className="wizard__doctor-avatar" />
                    <div>
                      <div className="wizard__doctor-name">ד"ר {doc.full_name}</div>
                      <div className="wizard__doctor-dept">{doc.department} · {doc.specialty}</div>
                    </div>
                    {selectedDoctor?.id === doc.id && <span className="wizard__check">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="wizard__panel">
            <p className="wizard__subtitle">בחר תאריך לתור אצל ד"ר {selectedDoctor?.full_name}</p>
            <div className="wizard__days">
              {getNext14Days().map((date) => {
                const d = new Date(date);
                const label = d.toLocaleDateString('he-IL', { weekday: 'short', day: 'numeric', month: 'numeric' });
                return (
                  <button
                    key={date}
                    className={`wizard__day-btn ${selectedDate === date ? 'wizard__day-btn--active' : ''}`}
                    onClick={() => setSelectedDate(date)}
                  >{label}</button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="wizard__panel">
            <p className="wizard__subtitle">שעות פנויות — {selectedDate}</p>
            {loadingSlots ? (
              <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>טוען שעות...</p>
            ) : slots.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>אין שעות פנויות ביום זה</p>
            ) : (
              <div className="wizard__slots">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    className={`wizard__slot ${selectedSlot === slot ? 'wizard__slot--active' : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                  >{slot}</button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="wizard__footer">
        {onClose && <button className="wizard__btn wizard__btn--ghost" onClick={onClose}>ביטול</button>}
        {step > 0 && <button className="wizard__btn wizard__btn--ghost" onClick={() => setStep(step - 1)}>חזור</button>}
        {step < 2 && (
          <button
            className="wizard__btn wizard__btn--primary"
            disabled={step === 0 ? !selectedDoctor : !selectedDate}
            onClick={() => setStep(step + 1)}
          >המשך</button>
        )}
        {step === 2 && (
          <button
            className="wizard__btn wizard__btn--primary"
            disabled={!selectedSlot || submitting}
            onClick={handleBook}
          >{submitting ? 'קובע תור...' : 'קביעת תור ✓'}</button>
        )}
      </div>
    </div>
  );
}
