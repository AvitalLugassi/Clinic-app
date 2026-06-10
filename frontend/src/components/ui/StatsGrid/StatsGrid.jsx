import './StatsGrid.css';

export default function StatsGrid({ title, cards }) {
  return (
    <div className="stats-grid">
      <h2 className="stats-grid-title">{title}</h2>
      <div className="stats-grid-cards">
        {cards.map((card) => (
          <div key={card.label} className="stats-grid-card">
            <span className="stats-grid-card-icon">{card.icon}</span>
            <p className="stats-grid-card-label">{card.label}</p>
            <h3 className="stats-grid-card-value">{card.value ?? '--'}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
