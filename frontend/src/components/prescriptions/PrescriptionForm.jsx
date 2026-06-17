import { useState } from 'react';
import { createPrescription } from '../../services/prescriptions.service';



import { useNotifications } from '../../context/NotificationContext';

export default function PrescriptionForm({ patientId, onClose, onSaved }) {
  const { addToast } = useNotifications();
  const [form, setForm] = useState({ medications: '', dosage: '', instructions: '', valid_until: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPrescription({ patient_id: patientId, ...form });
      addToast('המרשם נשמר בהצלחה', 'success');
      onSaved?.();
      onClose();
    } catch {
      addToast('שגיאה בשמירת המרשם', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h3 style={{ margin: '0 0 1rem' }}>💊 כתיבת מרשם</h3>
      <label style={styles.label}>תרופה
        <input name="medications" value={form.medications} onChange={handleChange} required style={styles.input} />
      </label>
      <label style={styles.label}>מינון
        <input name="dosage" value={form.dosage} onChange={handleChange} required style={styles.input} />
      </label>
      <label style={styles.label}>הוראות
        <input name="instructions" value={form.instructions} onChange={handleChange} style={styles.input} />
      </label>
      <label style={styles.label}>תוקף עד
        <input type="date" name="valid_until" value={form.valid_until} onChange={handleChange} required style={styles.input} />
      </label>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onClose} style={styles.btnSecondary}>ביטול</button>
        <button type="submit" disabled={loading} style={styles.btnPrimary}>{loading ? 'שומר...' : 'שמור מרשם'}</button>
      </div>
    </form>
  );
}

const styles = {
  form: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '1.25rem', marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  label: { display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 600 },
  input: { fontWeight: 400, padding: '0.4rem 0.6rem', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: '0.875rem' },
  btnPrimary: { padding: '0.4rem 1rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' },
  btnSecondary: { padding: '0.4rem 1rem', background: '#e2e8f0', border: 'none', borderRadius: 6, cursor: 'pointer' },
};
