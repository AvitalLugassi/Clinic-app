import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { getMe } from '../../services/auth.service';
import { getMyDashboard as getPatientDashboard } from '../../services/patients.service';
import { getMyDashboard as getDoctorDashboard } from '../../services/doctors.service';

export default function MyProfile() {
	const { user: ctxUser } = useAuthContext();
	const { uuid } = useParams();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [me, setMe] = useState(null);
	const [dashboard, setDashboard] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		let canceled = false;
		const load = async () => {
			setLoading(true);
			try {
				const meData = await getMe();
				if (canceled) return;
				setMe(meData);

				if (uuid && meData.user_uuid && uuid !== meData.user_uuid) {
					navigate(`/${meData.user_uuid}/profile`, { replace: true });
					return;
				}

				if (meData.role === 'patient') {
					const data = await getPatientDashboard();
					if (canceled) return;
					setDashboard(data);
				} else if (meData.role === 'doctor') {
					const data = await getDoctorDashboard();
					if (canceled) return;
					setDashboard(data);
				} else {
					setDashboard({ me: meData });
				}
			} catch (err) {
				setError(err);
				navigate('/login');
			} finally {
				if (!canceled) setLoading(false);
			}
		};
		load();
		return () => { canceled = true; };
	}, [uuid, navigate]);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>שגיאה בטעינת הפרופיל</div>;
	if (!me) return <div>לא נמצא משתמש</div>;

	const displayName = (me.full_name ?? me.name ?? `${me.firstName ?? ''} ${me.lastName ?? ''}`.trim()) || 'Unknown';

	return (
		<div className="my-profile-page">
			<h2>פרופיל משתמש</h2>
			<div className="profile-card">
				<img src={`https://i.pravatar.cc/150?img=${me.id || 1}`} alt="avatar" />
				<h3>{displayName}</h3>
				<p><strong>דוא"ל:</strong> {me.email ?? '—'}</p>
				<p><strong>תפקיד:</strong> {me.role ?? '—'}</p>
				<p><strong>טלפון:</strong> {me.phone ?? '—'}</p>
				<p><strong>UUID:</strong> {me.user_uuid ?? me.id}</p>
			</div>

			{me.role === 'patient' && dashboard?.patient && (
				<div className="patient-details">
					<h3>פרטי מטופל</h3>
					<p><strong>תאריך לידה:</strong> {dashboard.patient.date_of_birth ?? '—'}</p>
					<p><strong>סוג דם:</strong> {dashboard.patient.blood_type ?? '—'}</p>
					<p><strong>אלרגיות:</strong> {dashboard.patient.allergies ?? '—'}</p>
					<p><strong>כתובת:</strong> {dashboard.patient.address ?? '—'}</p>
					<p><strong>איש קשר חירום:</strong> {dashboard.patient.emergency_contact_name ?? '—'} ({dashboard.patient.emergency_contact_phone ?? '—'})</p>

					<h4>תורים קרובים</h4>
					<ul>
						{dashboard.appointments?.length ? dashboard.appointments.map(a => (
							<li key={a.id}>{new Date(a.scheduled_at).toLocaleString()} — {a.doctor_name ?? a.department ?? ''} — {a.status}</li>
						)) : <li>אין תורים קרובים</li>}
					</ul>

					<h4>מרשמים בתוקף</h4>
					<ul>
						{dashboard.prescriptions?.length ? dashboard.prescriptions.map(p => (
							<li key={p.id}>{p.medications} — פג תוקף: {p.valid_until}</li>
						)) : <li>אין מרשמים</li>}
					</ul>
				</div>
			)}

			{me.role === 'doctor' && dashboard?.doctor && (
				<div className="doctor-details">
					<h3>פרטי רופא</h3>
					<p><strong>התמחות:</strong> {dashboard.doctor.specialty ?? '—'}</p>
					<p><strong>מספר רישיון:</strong> {dashboard.doctor.license_number ?? '—'}</p>
					<p><strong>מחלקה:</strong> {dashboard.doctor.department ?? '—'}</p>

					<h4>תורים קרובים</h4>
					<ul>
						{dashboard.appointments?.length ? dashboard.appointments.map(a => (
							<li key={a.id}>{new Date(a.scheduled_at).toLocaleString()} — {a.patient_name ?? ''} — {a.status}</li>
						)) : <li>אין תורים קרובים</li>}
					</ul>
				</div>
			)}
		</div>
	);
}
