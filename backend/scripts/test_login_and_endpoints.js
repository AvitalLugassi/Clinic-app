const BASE = 'http://localhost:3000';

async function main(){
  try{
    const creds = { email: 'admin@clinic-app.com', password: 'Admin123!' };
    const login = await fetch(`${BASE}/api/auth/staff-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(creds),
    });
    console.log('login status', login.status);

    const setCookie = login.headers.get('set-cookie');
    console.log('set-cookie header:', setCookie);
    const cookie = setCookie ? setCookie.split(',').map(s => s.split(';')[0]).join('; ') : '';

    const appt = await fetch(`${BASE}/api/appointments/patient-appointments?patient_id=5`, { headers: { Cookie: cookie } });
    console.log('appointments status', appt.status);
    console.log(await appt.text());

    // staff should request a specific patient
    const pres = await fetch(`${BASE}/api/prescriptions/my?patient_id=5`, { headers: { Cookie: cookie } });
    console.log('prescriptions status', pres.status);
    console.log(await pres.text());
  }catch(err){
    console.error(err);
    process.exit(1);
  }
}

main();
