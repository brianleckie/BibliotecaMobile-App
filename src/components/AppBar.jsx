import escudo from '../assets/escudo.png';
import Icon from './Icon';

function Crest({ size = 38 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 999, flexShrink: 0,
      background: '#fff', border: '1.5px solid rgba(255,255,255,.55)',
      boxShadow: '0 1px 4px rgba(0,0,0,.18)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    }}>
      <img src={escudo} alt="Escudo C.T.N.E." style={{ width: '84%', height: '84%', objectFit: 'contain' }} />
    </div>
  );
}

// AppBar estándar con escudo + "Biblioteca"
export function AppBar({ subtitle }) {
  return (
    <div style={{
      background: 'var(--navy)', color: '#fff',
      padding: '10px 18px 12px',
      display: 'flex', alignItems: 'center', gap: 12,
      flexShrink: 0, boxShadow: '0 1px 0 rgba(0,0,0,.06)',
    }}>
      <Crest size={38} />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <span style={{ fontFamily: 'Lora, serif', fontSize: 18, fontWeight: 600 }}>Biblioteca</span>
        <span style={{ fontSize: 9.5, opacity: .72, letterSpacing: '.16em', textTransform: 'uppercase' }}>
          {subtitle || 'C.T.N. Encarnación'}
        </span>
      </div>
    </div>
  );
}

// AppBar con botón de volver (para detalle de libro)
export function AppBarBack({ title, onBack }) {
  return (
    <div style={{
      background: 'var(--navy)', color: '#fff',
      padding: '8px 10px',
      display: 'flex', alignItems: 'center', gap: 6,
      flexShrink: 0,
    }}>
      <button
        onClick={onBack}
        style={{
          border: 'none', background: 'none', cursor: 'pointer',
          padding: 8, display: 'flex', color: '#fff',
        }}
      >
        <Icon name="back" size={22} stroke={2.2} />
      </button>
      <span style={{ fontSize: 14, fontWeight: 600, opacity: .9 }}>{title}</span>
    </div>
  );
}
