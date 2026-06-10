import './Button.css';

export default function Button({ children, variant = 'primary', size = 'md', disabled, onClick, type = 'button', fullWidth }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''}`}
    >
      {children}
    </button>
  );
}
