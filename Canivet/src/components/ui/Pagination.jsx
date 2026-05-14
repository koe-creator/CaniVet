const css = `
.pagination { display:flex; align-items:center; gap:8px; padding-top:14px; border-top:1px solid #f1f5f9; }
.page-btn { padding:7px 12px; border:1px solid #e2e8f0; border-radius:8px; background:#fff; font-size:13px; font-weight:600; color:#475569; cursor:pointer; transition:all .12s; }
.page-btn:hover:not(:disabled) { border-color:#3b82f6; color:#1d4ed8; background:#eff6ff; }
.page-btn:disabled { opacity:.4; cursor:not-allowed; }
.page-info { font-size:12px; color:#94a3b8; margin-left:auto; }
`

export const Pagination = ({ page, totalPages, total, pageSize, hasPrev, hasMore, onPrev, onNext }) => {
  if (!totalPages || totalPages <= 1) return null
  const from = page * pageSize + 1
  const to   = Math.min((page + 1) * pageSize, total)

  return (
    <>
      <style>{css}</style>
      <div className="pagination">
        <button className="page-btn" onClick={onPrev} disabled={!hasPrev}>← Anterior</button>
        <span style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>
          Página {page + 1} de {totalPages}
        </span>
        <button className="page-btn" onClick={onNext} disabled={!hasMore}>Siguiente →</button>
        <span className="page-info">{from}–{to} de {total} registros</span>
      </div>
    </>
  )
}
