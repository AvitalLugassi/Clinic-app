import './Spinner.css';

export default function Spinner({ size = 'md', fullPage }) {
  if (fullPage) {
    return (
      <div className="spinner-fullpage">
        <div className={`spinner spinner-${size}`} />
      </div>
    );
  }
  return <div className={`spinner spinner-${size}`} />;
}
