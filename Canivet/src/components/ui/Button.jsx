export const Button = ({
  children,
  onClick,
  variant = 'primary',
  type = 'button',
  disabled = false,
  fullWidth = false,
}) => {
  const styles = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    edit: 'btn-edit',
    danger: 'btn-del',
  }

  return (
    <button
      type={type}
      className={styles[variant] || 'btn-primary'}
      onClick={onClick}
      disabled={disabled}
      style={fullWidth ? { width: '100%', justifyContent: 'center' } : {}}
    >
      {children}
    </button>
  )
}
