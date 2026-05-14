export const Input = ({
  label, type = 'text', value, onChange,
  placeholder, error, required = false
}) => (
  <div className="form-group">
    {label && (
      <label className="form-label">
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
    )}
    <input
      className="form-input"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    {error && <p className="form-error">{error}</p>}
  </div>
)