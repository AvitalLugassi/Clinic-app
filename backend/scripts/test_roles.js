const BASE = 'http://localhost:3000';

const roles = [
  {
    name: 'admin',
    type: 'staff',
    creds: { email: 'admin@clinic-app.com', password: 'Admin123!' },
    ids: { patient_id: 5, doctor_id: 2 }
  },
  {
    name: 'doctor',
    type: 'staff',
    creds: { email: 'sara@clinic-app.com', password: 'Doctor123!' },
    ids: { doctor_id: 2, patient_id: 5 }
  },
  {
    name: 'patient',
    type: 'patient',
    creds: { id_number: '100000009', password: 'Patient123!' },
    ids: { patient_id: 4, doctor_id: 2 }
  }
];

async function login(role){
  if(role.type === 'staff'){
    const r = await fetch(`${BASE}/api/auth/staff-login`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(role.creds) });
    return r;
  } else {
    const r = await fetch(`${BASE}/api/auth/patient-login`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(role.creds) });
    return r;
  }
}

function extractCookie(setCookieHeader){
  if(!setCookieHeader) return '';
  // setCookieHeader may contain multiple cookies separated by comma
  return setCookieHeader.split(',').map(s => s.split(';')[0]).join('; ');
}

async function run(){
  for(const role of roles){
    console.log('\n=== Role:', role.name, '===');
    try{
      const loginRes = await login(role);
      console.log('login status', loginRes.status);
      const setCookie = loginRes.headers.get('set-cookie');
      const cookie = extractCookie(setCookie);
      console.log('cookie:', cookie ? cookie.slice(0,80) + (cookie.length>80? '...' : '') : '(none)');

      // Try create appointment
      const apptBody = {
        patient_id: role.ids.patient_id,
        doctor_id: role.ids.doctor_id,
        scheduled_at: '2026-07-02 09:00:00'
      };
      const createRes = await fetch(`${BASE}/api/appointments`, { method: 'POST', headers: { 'Content-Type':'application/json', Cookie: cookie }, body: JSON.stringify(apptBody) });
      console.log('create appointment status', createRes.status);
      console.log(await createRes.text());

      // Fetch patient appointments
      const paRes = await fetch(`${BASE}/api/appointments/patient-appointments?patient_id=${role.ids.patient_id}`, { headers: { Cookie: cookie } });
      console.log('patient-appointments status', paRes.status);
      console.log(await paRes.text());

      // Fetch doctor appointments
      const daRes = await fetch(`${BASE}/api/appointments/doctor/${role.ids.doctor_id}`, { headers: { Cookie: cookie } });
      console.log('doctor-appointments status', daRes.status);
      console.log(await daRes.text());

    }catch(err){
      console.error('Error for role', role.name, err);
    }
  }
}

run();
