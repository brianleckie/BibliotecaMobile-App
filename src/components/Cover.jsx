import Icon from './Icon';

let coverCounter = 0;

export default function Cover({ bookId = 0, available = true, h = 132, w = '100%', radius = 8 }) {
  const pid = `cv-${bookId}-${h}`;
  const tint = available ? 'var(--navy)' : 'var(--muted)';
  return (
    <div style={{
      width: w, height: h, borderRadius: radius, overflow: 'hidden',
      position: 'relative', border: '1px solid var(--border)',
      background: 'var(--surface-alt)', flexShrink: 0,
    }}>
      <svg width="100%" height="100%" style={{ display: 'block', position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id={pid} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="10" height="10" fill="transparent" />
            <rect width="5" height="10" fill={tint} opacity="0.07" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${pid})`} />
      </svg>
      <Icon
        name="book"
        size={Math.min(28, (typeof h === 'number' ? h : 80) * 0.22)}
        color="var(--faint)"
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-60%)' }}
      />
      <span style={{
        position: 'absolute', bottom: 6, left: 7,
        fontFamily: 'monospace', fontSize: 8,
        letterSpacing: '.06em', color: 'var(--faint)', textTransform: 'uppercase',
      }}>
        portada
      </span>
    </div>
  );
}
