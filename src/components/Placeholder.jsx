export function Placeholder({ tone = 'default', label, height, style, className = '', imageUrl }) {
  const cls =
    tone === 'accent' ? 'sp-placeholder sp-placeholder--accent'
    : tone === 'dark' ? 'sp-placeholder sp-placeholder--dark'
    : 'sp-placeholder';

  if (imageUrl) {
    return (
      <div className={`${cls} ${className}`} style={{ height, ...style, overflow: 'hidden' }}>
        <img
          src={imageUrl}
          alt={label || ''}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
    );
  }

  return (
    <div className={`${cls} ${className}`} style={{ height, ...style }}>
      {label && <span>{label}</span>}
    </div>
  );
}
