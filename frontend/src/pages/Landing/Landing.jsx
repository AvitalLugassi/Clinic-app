import './Landing.css';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="landing-root">
      <header className="landing-hero">
        <div className="landing-inner">
          <h1>מרפאת דוגמה - טיפול מסור ומקצועי</h1>
          <p>רופאים מומחים בתחומים שונים, שירותי מרפאה מתקדמים ותורים נוחים.</p>
          <div className="landing-cta">
            <Link to="/login" className="btn-primary">התחבר</Link>
            <Link to="/register" className="btn-outline">הרשם</Link>
          </div>
        </div>
      </header>

      <section className="landing-about">
        <div className="container">
          <h2>עלינו</h2>
          <p>אנו מספקים שירותי בריאות איכותיים עם דגש על יחס אישי וטיפול עדכני בטכנולוגיות מתקדמות.</p>
        </div>
      </section>

      <section className="landing-doctors">
        <div className="container">
          <h2>צוות הרופאים</h2>
          <div className="doctors-grid">
            <div className="doctor-card">
              <div className="doctor-avatar">ד"ר א</div>
              <h3>ד"ר אבי כהן</h3>
              <p>מומחה ברפואת משפחה עם ניסיון של 15 שנה.</p>
            </div>
            <div className="doctor-card">
              <div className="doctor-avatar">ד"ר ב</div>
              <h3>ד"ר בר שקד</h3>
              <p>מומחית בכירורגיה כללית וטיפול בנושאים מורכבים.</p>
            </div>
            <div className="doctor-card">
              <div className="doctor-avatar">ד"ר ג</div>
              <h3>ד"ר גילה לוי</h3>
              <p>מומחית ברפואה פנימית וטיפולי מניעתיים.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">© כל הזכויות שמורות למרפאת דוגמה</div>
      </footer>
    </div>
  );
}
