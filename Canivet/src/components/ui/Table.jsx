export const Table = ({ columns, data, loading, emptyMsg = 'Sin registros' }) => (
  <div className="tbl-wrap">
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key} style={col.width ? { width: col.width } : {}}>
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr><td colSpan={columns.length} className="empty-state">Cargando...</td></tr>
        ) : data.length === 0 ? (
          <tr><td colSpan={columns.length} className="empty-state">{emptyMsg}</td></tr>
        ) : (
          data.map((row, index) => (
            <tr key={row.id || index}>
              {columns.map((col) => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
)
