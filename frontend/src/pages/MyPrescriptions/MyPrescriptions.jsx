import useFetch from '../../hooks/useFetch';
import { getMyPrescriptions } from '../../services/prescriptions.service';

export default function MyPrescriptions() {
  const { data: prescriptions = [], loading, error } = useFetch(getMyPrescriptions);

  if (loading) return <p>טוען מרשמים...</p>;
  if (error)   return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <section style={{ padding: '1.5rem' }}>
      <h2>💊 המרשמים שלי</h2>

      {prescriptions.length === 0 ? (
        <p>אין מרשמים</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'right' }}>
              <th style={th}>תרופה</th>
              <th style={th}>מינון</th>
              <th style={th}>הוראות</th>
              <th style={th}>רופא</th>
              <th style={th}>תוקף עד</th>
              <th style={th}>סטטוס</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((rx) => {
              const expDate   = new Date(rx.valid_until);
              const isExpired = expDate < new Date();
              return (
                <tr key={rx.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={td}>{rx.medications}</td>
                  <td style={td}>{rx.dosage}</td>
                  <td style={td}>{rx.instructions || '—'}</td>
                  <td style={td}>{rx.doctor_name}</td>
                  <td style={td}>{expDate.toLocaleDateString('he-IL')}</td>
                  <td style={td}>
                    <span style={{ color: isExpired ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
                      {isExpired ? 'פג תוקף' : 'פעיל'}
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

const th = { padding: '0.75rem 1rem', fontWeight: 600 };
const td = { padding: '0.75rem 1rem' };
