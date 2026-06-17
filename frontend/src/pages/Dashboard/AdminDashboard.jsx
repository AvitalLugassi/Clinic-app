import { useState } from 'react';
import StatsGrid from '../../components/ui/StatsGrid/StatsGrid';
import Button from '../../components/ui/Button/Button';
import RegisterUserModal from '../../components/ui/RegisterUserModal/RegisterUserModal';
import { staffRegister, adminRegisterPatient } from '../../services/auth.service';
import { useNotifications } from '../../context/NotificationContext';

const STATS = [
  { icon: '🧑‍⚕️', label: 'Total Patients', value: null },
  { icon: '👨‍⚕️', label: 'Total Doctors', value: null },
  { icon: '📅', label: 'Appointments Today', value: null },
  { icon: '📈', label: 'Pending Reports', value: null },
];

const PATIENT_FIELDS = [
  { name: 'full_name',  label: 'שם מלא',        placeholder: 'ישראל ישראלי',   validation: { required: true } },
  { name: 'id_number',  label: 'תעודת זהות',     placeholder: '123456789',      validation: { required: true, idNumber: true } },
  { name: 'email',      label: 'אימייל',          placeholder: 'example@mail.com', validation: { required: true, email: true } },
  { name: 'phone',      label: 'טלפון',           placeholder: '050-0000000' },
];

const STAFF_FIELDS = [
  { name: 'full_name',  label: 'שם מלא',          placeholder: 'ד"ר ישראל ישראלי', validation: { required: true } },
  { name: 'email',      label: 'אימייל',            placeholder: 'name@clinic-app.com', validation: { required: true, staffEmail: true } },
  { name: 'password',   label: 'סיסמה',            placeholder: 'לפחות 6 תווים',  validation: { required: true, minLength: 6 }, type: 'password' },
  { name: 'phone',      label: 'טלפון',             placeholder: '050-0000000' },
  { name: 'role',       label: 'תפקיד',             validation: { required: true },
    options: [{ value: 'doctor', label: 'רופא' }, { value: 'admin', label: 'אדמין' }] },
];

export default function AdminDashboard() {
  const { addToast } = useNotifications();
  const [modal, setModal] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const openModal = (type) => { setModal(type); setError(''); };
  const closeModal = () => { setModal(null); setError(''); };

  const handleSubmit = async (data) => {
    setError('');
    setSubmitting(true);
    try {
      const res = modal === 'patient' ? await adminRegisterPatient(data) : await staffRegister(data);
      addToast(res.data.message, 'success');
      closeModal();
    } catch (err) {
      const msg = err.response?.data?.message || 'שגיאה, נסה שוב';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <StatsGrid
        title="Admin Dashboard"
        cards={STATS}
        actions={
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button onClick={() => openModal('patient')}>+ רשום מטופל</Button>
            <Button onClick={() => openModal('staff')}>+ רשום צוות</Button>
          </div>
        }
      />

      <RegisterUserModal
        isOpen={modal === 'patient'}
        onClose={closeModal}
        title="רישום מטופל חדש"
        fields={PATIENT_FIELDS}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={error}
      />

      <RegisterUserModal
        isOpen={modal === 'staff'}
        onClose={closeModal}
        title="רישום איש צוות"
        fields={STAFF_FIELDS}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={error}
      />
    </>
  );
}
