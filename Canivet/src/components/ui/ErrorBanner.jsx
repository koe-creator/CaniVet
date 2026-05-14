export const ErrorBanner = ({ message, onRetry }) => {
  if (!message) return null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '12px 14px',
        marginBottom: 16,
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: 10,
        color: '#b91c1c',
        fontSize: 13,
        fontWeight: 500,
      }}
    >
      <span>{message}</span>
      {onRetry && (
        <button className="btn-secondary" onClick={onRetry} type="button">
          Reintentar
        </button>
      )}
    </div>
  )
}
