import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import escudo from '../assets/escudo.png';
import Icon from './Icon';
import { useAuth } from '../context/AuthContext';

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

function UserMenu() {
  const { token, clearToken } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [open]);

  const go = (path) => { setOpen(false); navigate(path); };
  const logout = () => { setOpen(false); clearToken(); navigate('/catalogo'); };

  if (!token) {
    return (
      <button
        onClick={() => navigate('/login')}
        title="Iniciar sesión"
        style={{
          border: 'none', background: 'rgba(255,255,255,.15)', cursor: 'pointer',
          padding: 8, borderRadius: 999, display: 'flex', color: '#fff',
          transition: 'background .2s',
        }}
      >
        <Icon name="user" size={20} stroke={1.9} />
      </button>
    );
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        title="Mi cuenta"
        style={{
          border: 'none', background: open ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.15)',
          cursor: 'pointer', padding: 8, borderRadius: 999,
          display: 'flex', color: '#fff', transition: 'background .2s',
        }}
      >
        <Icon name="user" size={20} stroke={2.2} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 12, minWidth: 180,
          boxShadow: '0 8px 24px rgba(0,0,0,.14)',
          zIndex: 100, overflow: 'hidden',
        }}>
          {[
            { label: 'Mis Préstamos', icon: 'bookmark', action: () => go('/mis-prestamos') },
            { label: 'Mi Perfil',     icon: 'user',     action: () => go('/perfil') },
          ].map(item => (
            <button key={item.label} onClick={item.action} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '12px 14px', border: 'none', background: 'none',
              cursor: 'pointer', color: 'var(--ink)', fontSize: 13.5, fontWeight: 500,
              borderBottom: '1px solid var(--border)',
              textAlign: 'left',
            }}>
              <Icon name={item.icon} size={16} color="var(--navy)" stroke={2} />
              {item.label}
            </button>
          ))}
          <button onClick={logout} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 14px', border: 'none', background: 'none',
            cursor: 'pointer', color: 'var(--no)', fontSize: 13.5, fontWeight: 500,
            textAlign: 'left',
          }}>
            <Icon name="logout" size={16} color="var(--no)" stroke={2} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}

// AppBar estándar con escudo + "Biblioteca" + menú de usuario
export function AppBar({ subtitle }) {
  return (
    <div style={{
      background: 'var(--navy)', color: '#fff',
      padding: '10px 18px 12px',
      display: 'flex', alignItems: 'center', gap: 12,
      flexShrink: 0, boxShadow: '0 1px 0 rgba(0,0,0,.06)',
    }}>
      <Crest size={38} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <span style={{ fontFamily: 'Lora, serif', fontSize: 18, fontWeight: 600 }}>Biblioteca</span>
        <span style={{ fontSize: 9.5, opacity: .72, letterSpacing: '.16em', textTransform: 'uppercase' }}>
          {subtitle || 'C.T.N. Encarnación'}
        </span>
      </div>
      <UserMenu />
    </div>
  );
}

// AppBar con botón de volver (para detalle de libro) — sin menú de usuario
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
