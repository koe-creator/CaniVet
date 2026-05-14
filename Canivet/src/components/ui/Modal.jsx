export const Modal = ({
  title,
  onClose,
  onSave,
  saveLabel = 'Guardar',
  children,
  footer = null,
  hideDefaultFooter = false,
}) => (
  <div
    className="modal-overlay"
    onClick={(e) => e.target.className === 'modal-overlay' && onClose()}
  >
    <div className="modal-box">
      <div className="modal-hd">
        <h2>{title}</h2>
        <button className="btn-close" onClick={onClose}>x</button>
      </div>
      <div className="modal-body">{children}</div>
      {hideDefaultFooter ? footer : (
        <div className="modal-ft">
          {footer || (
            <>
              <button className="btn-secondary" onClick={onClose}>Cancelar</button>
              <button className="btn-primary" onClick={onSave}>{saveLabel}</button>
            </>
          )}
        </div>
      )}
    </div>
  </div>
)
