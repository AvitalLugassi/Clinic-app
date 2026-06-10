import './Input.css';

export default function Input({ label, name, type = 'text', value, onChange, error, placeholder, disabled }) {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label" htmlFor={name}>{label}</label>}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`input-field ${error ? 'input-error' : ''}`}
      />
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
}
