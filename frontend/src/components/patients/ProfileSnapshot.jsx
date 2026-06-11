import './ProfileSnapshot.css';

export default function ProfileSnapshot({ patient }) {
  if (!patient) return null;

  const completionFields = ['address', 'emergencyContact', 'allergies', 'bloodType'];
  const filled = completionFields.filter((f) => patient[f]).length;
  const completionPct = Math.round((filled / completionFields.length) * 100);

  return (
    <aside className="profile-snapshot">
      <div className="profile-snapshot__avatar">
        {patient.name?.[0]?.toUpperCase() ?? '?'}
      </div>
      <h3 className="profile-snapshot__name">{patient.name}</h3>
      <p className="profile-snapshot__id">ת.ז. {patient.idNumber}</p>

      <ul className="profile-snapshot__details">
        <li><span>🩸 סוג דם</span><strong>{patient.bloodType ?? '—'}</strong></li>
        <li><span>⚠️ אלרגיות</span><strong>{patient.allergies ?? '—'}</strong></li>
        <li><span>📞 טלפון</span><strong>{patient.phone ?? '—'}</strong></li>
        <li><span>👤 איש קשר</span><strong>{patient.emergencyContact ?? '—'}</strong></li>
      </ul>

      <div className="profile-snapshot__completion">
        <div className="profile-snapshot__completion-header">
          <span>השלמת פרופיל</span>
          <span>{completionPct}%</span>
        </div>
        <div className="profile-snapshot__completion-bar">
          <div
            className="profile-snapshot__completion-fill"
            style={{ width: `${completionPct}%` }}
          />
        </div>
        {completionPct < 100 && (
          <p className="profile-snapshot__completion-hint">השלימי את הפרטים הרפואיים שלך</p>
        )}
      </div>
    </aside>
  );
}
