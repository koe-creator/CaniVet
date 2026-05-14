export const Card = ({ children, padding = '18px 20px', style = {} }) => (
  <div className="card" style={{ padding, ...style }}>
    {children}
  </div>
)