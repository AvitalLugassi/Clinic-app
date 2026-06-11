import { Link } from 'react-router-dom';
import '../../../pages/Login/Login.css';

export default function AuthCard({ subtitle, onSubmit, error, children, footer }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-logo">🏥</span>
          <h1 className="auth-title">ClinicApp</h1>
          <p className="auth-subtitle">{subtitle}</p>
        </div>
        <form className="auth-form" noValidate onSubmit={onSubmit}>
          {error && <p className="auth-error">{error}</p>}
          {children}
        </form>
        <p className="auth-footer">
          {footer.text} <Link to={footer.to}>{footer.linkLabel}</Link>
        </p>
      </div>
    </div>
  );
}
