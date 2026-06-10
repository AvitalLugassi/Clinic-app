import './Table.css';
import Spinner from '../Spinner/Spinner';

export default function Table({ columns, data, loading, emptyMessage = 'אין נתונים להצגה' }) {
  if (loading) return <Spinner />;

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="table-th">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="table-empty">{emptyMessage}</td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row.id ?? i} className="table-tr">
                {columns.map((col) => (
                  <td key={col.key} className="table-td">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
