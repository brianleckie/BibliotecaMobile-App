const MAP = {
  ok:      { c: 'var(--ok)',   b: 'var(--ok-bg)' },
  no:      { c: 'var(--no)',   b: 'var(--no-bg)' },
  warn:    { c: 'var(--warn)', b: 'var(--warn-bg)' },
  neutral: { c: 'var(--muted)', b: 'var(--surface-alt)' },
};

export default function Badge({ kind, children, dot = true }) {
  const s = MAP[kind] || MAP.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: s.b, color: s.c,
      fontSize: 11.5, fontWeight: 600,
      padding: '3px 9px', borderRadius: 999,
      lineHeight: 1.35, whiteSpace: 'nowrap',
    }}>
      {dot && (
        <span style={{ width: 6, height: 6, borderRadius: 999, background: s.c, flexShrink: 0 }} />
      )}
      {children}
    </span>
  );
}
