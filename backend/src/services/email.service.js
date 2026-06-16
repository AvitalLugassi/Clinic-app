import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export const sendRegistrationOtp = async (to, code) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: 'השלמת רישום - Clinic App',
    html: `
      <div style="font-family:Arial,sans-serif;direction:rtl;text-align:right">
        <h2>ברוך הבא ל-Clinic App</h2>
        <p>להשלמת הרישום, הזן את הקוד הבא:</p>
        <h1 style="letter-spacing:8px;color:#2563eb">${code}</h1>
        <p>הקוד תקף ל-10 דקות בלבד.</p>
      </div>
    `,
  });
};

export const sendStaffActivationOtp = async (to, code, role) => {
  const roleLabel = role === 'admin' ? 'מנהל' : 'רופא';
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `הפעלת חשבון ${roleLabel} - Clinic App`,
    html: `
      <div style="font-family:Arial,sans-serif;direction:rtl;text-align:right">
        <h2>ברוך הבא ל-Clinic App</h2>
        <p>קיבלת חשבון ${roleLabel} במרפאה. להשלמת ההפעלה וקביעת סיסמה, הזן את הקוד הבא:</p>
        <h1 style="letter-spacing:8px;color:#2563eb">${code}</h1>
        <p>הקוד תקף ל-10 דקות בלבד.</p>
      </div>
    `,
  });
};
export const sendOtpEmail = async (to, code, purpose) => {
  const purposeLabel = purpose === 'view_records' ? 'צפייה ברשומות רפואיות' : 'פעולה רגישה';
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `קוד אימות - ${purposeLabel}`,
    html: `
      <div style="font-family:Arial,sans-serif;direction:rtl;text-align:right">
        <h2>קוד האימות שלך</h2>
        <p>הקוד לביצוע <strong>${purposeLabel}</strong>:</p>
        <h1 style="letter-spacing:8px;color:#2563eb">${code}</h1>
        <p>הקוד תקף ל-10 דקות בלבד.</p>
        <p style="color:#888;font-size:12px">אם לא ביקשת קוד זה, התעלם מהודעה זו.</p>
      </div>
    `,
  });
};
