import './StatusBadge.css';

const CONFIG = {
  confirmed: { label: 'מאושר',   color: 'green'  },
  pending:   { label: 'ממתין',   color: 'yellow' },
  completed: { label: 'הושלם',   color: 'blue'   },
  cancelled: { label: 'בוטל',    color: 'red'    },
};

export default function StatusBadge({ status }) {
  const { label, color } = CONFIG[status] ?? { label: status, color: 'gray' };
  return <span className={`status-badge status-badge--${color}`}>{label}</span>;
}
