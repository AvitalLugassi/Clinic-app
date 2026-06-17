import { useState, useMemo } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import useFetch from '../../hooks/useFetch';
import { getPatientMedicalHistory, createMedicalRecord } from '../../services/medicalRecords.service';
import { getAppointmentsByDoctor } from '../../services/appointments.service';
import { getMyDashboard } from '../../services/patients.service';

export default function MedicalRecord() {
  const { user } = useAuthContext();
  const isDoctor = user?.role === 'doctor';

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { data: dashboard } = useFetch(
    () => !isDoctor ? getMyDashboard() : Promise.resolve(null),
    [isDoctor]
  );

  const patientTarget = isDoctor ? selectedPatient?.patient_id : dashboard?.patient?.id;
  const { data: history = [], loading: loadingHistory, refetch: refetchHistory } = useFetch(
    () => patientTarget ? getPatientMedicalHistory(patientTarget) : Promise.resolve([]),
    [patientTarget]
  );

  const { data: appointments = [] } = useFetch(
    () => isDoctor ? getAppointmentsByDoctor(user.id) : Promise.resolve([]),
    [isDoctor]
  );

  // deduplicate patients from appointments
  const allPatients = useMemo(() => {
    const seen = new Set();
    return (Array.isArray(appointments) ? appointments : []).filter((a) => {
      if (seen.has(a.patient_id)) return false;
      seen.add(a.patient_id);
      return true;
    });
  }, [appointments]);

  const filtered = search
    ? allPatients.filter((p) => p.patient_name?.includes(search))
    : [];

  return (
    <div style={styles.page}>
      <h2>🗂️ תיק רפואי</h2>

      {isDoctor && (
        <div style={styles.searchBox}>
          <input
            placeholder="חיפוש מטופל לפי שם או תז"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />
          {search && filtered.length > 0 && (
            <ul style={styles.dropdown}>
              {filtered.map((p) => (
                <li key={p.patient_id} style={styles.dropdownItem} onClick={() => { setSelectedPatient(p); setSearch(''); setShowForm(false); }}>
                  {p.patient_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {isDoctor && !selectedPatient && (
        <p style={{ color: '#94a3b8' }}>בחר מטופל כדי לצפות בתיק הרפואי שלו</p>
      )}

      {(!isDoctor || selectedPatient) && (
        <>
          {isDoctor && (
            <div style={styles.patientBar}>
              <strong>{selectedPatient?.patient_name}</strong>
              <button style={styles.btnPrimary} onClick={() => setShowForm((v) => !v)}>
                {showForm ? 'סגור טופס' : '＋ רשומה חדשה'}
              </button>
            </div>
          )}

          {showForm && (
            <NewRecordForm
              patientId={selectedPatient?.patient_id}
              doctorId={user?.id}
              onSaved={() => { setShowForm(false); refetchHistory(); }}
            />
          )}

          {loadingHistory ? (
            <p>טוען היסטוריה...</p>
          ) : history.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>אין רשומות רפואיות</p>
          ) : (
            <div style={styles.list}>
              {history.map((rec) => (
                <div key={rec._id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <span>📅 {new Date(rec.createdAt).toLocaleDateString('he-IL')}</span>
                    {rec.diagnoses?.length > 0 && <span style={styles.tag}>🔍 {rec.diagnoses.join(', ')}</span>}
                  </div>
                  <p style={{ margin: '0.5rem 0 0' }}>{rec.visit_summary}</p>
                  {rec.prescriptions?.length > 0 && <p style={styles.detail}>💊 {rec.prescriptions.join(', ')}</p>}
                  {rec.referrals?.length > 0 && <p style={styles.detail}>📋 הפניות: {rec.referrals.join(', ')}</p>}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function NewRecordForm({ patientId, doctorId, onSaved }) {
  const { addToast } = useNotifications();
  const [form, setForm] = useState({ visit_summary: '', diagnoses: '', prescriptions: '', referrals: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createMedicalRecord({
        appointment_uuid: `manual-${Date.now()}`,
        patient_id: patientId,
        doctor_id: doctorId,
        visit_summary: form.visit_summary,
        diagnoses: form.diagnoses ? form.diagnoses.split(',').map((s) => s.trim()) : [],
        prescriptions: form.prescriptions ? form.prescriptions.split(',').map((s) => s.trim()) : [],
        referrals: form.referrals ? form.referrals.split(',').map((s) => s.trim()) : [],
      });
      addToast('הרשומה נשמרה בהצלחה', 'success');
      onSaved();
    } catch {
      addToast('שגיאה בשמירת הרשומה', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <label style={styles.label}>סיכום ביקור *
        <textarea name="visit_summary" required value={form.visit_summary}
          onChange={(e) => setForm((f) => ({ ...f, visit_summary: e.target.value }))}
          style={{ ...styles.input, minHeight: 80 }} />
      </label>
      <label style={styles.label}>אבחנות (מופרדות בפסיק)
        <input value={form.diagnoses} onChange={(e) => setForm((f) => ({ ...f, diagnoses: e.target.value }))} style={styles.input} />
      </label>
      <label style={styles.label}>מרשמים (מופרדים בפסיק)
        <input value={form.prescriptions} onChange={(e) => setForm((f) => ({ ...f, prescriptions: e.target.value }))} style={styles.input} />
      </label>
      <label style={styles.label}>הפניות (מופרדות בפסיק)
        <input value={form.referrals} onChange={(e) => setForm((f) => ({ ...f, referrals: e.target.value }))} style={styles.input} />
      </label>
      <button type="submit" disabled={loading} style={styles.btnPrimary}>{loading ? 'שומר...' : 'שמור רשומה'}</button>
    </form>
  );
}

const styles = {
  page: { padding: '1.5rem', direction: 'rtl' },
  searchBox: { position: 'relative', maxWidth: 400, marginBottom: '1rem' },
  input: { width: '100%', padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box' },
  dropdown: { position: 'absolute', top: '100%', right: 0, left: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 6, listStyle: 'none', margin: 0, padding: 0, zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
  dropdownItem: { padding: '0.6rem 1rem', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' },
  patientBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '1rem' },
  cardHeader: { display: 'flex', gap: '1rem', alignItems: 'center', fontWeight: 600 },
  tag: { background: '#eff6ff', color: '#3b82f6', padding: '0.2rem 0.5rem', borderRadius: 4, fontSize: '0.8rem' },
  detail: { margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.875rem' },
  form: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  label: { display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 600 },
  btnPrimary: { alignSelf: 'flex-end', padding: '0.4rem 1.25rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' },
};
