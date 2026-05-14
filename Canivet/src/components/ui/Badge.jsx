const VARIANTS = {
  blue:   'tag-blue',
  green:  'tag-green',
  amber:  'tag-amber',
  red:    'tag-red',
  purple: 'tag-purple',
}

export const Badge = ({ children, variant = 'blue' }) => (
  <span className={`tag ${VARIANTS[variant] || 'tag-blue'}`}>
    {children}
  </span>
)