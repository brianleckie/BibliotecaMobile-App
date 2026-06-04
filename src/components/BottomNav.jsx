import { useNavigate, useLocation } from 'react-router-dom';
import Icon from './Icon';

const TABS = [
  { id: 'catalogo',   path: '/catalogo',   label: 'Catálogo',   icon: 'book' },
  { id: 'autores',    path: '/autores',    label: 'Autores',    icon: 'user' },
  { id: 'categorias', path: '/categorias', label: 'Categorías', icon: 'filter' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const activeId = pathname.startsWith('/libro')
    ? 'catalogo'
    : TABS.find(t => pathname.startsWith(t.path))?.id;

  return (
    <div style={{
      flexShrink: 0, background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      display: 'flex', padding: '8px 8px 18px',
    }}>
      {TABS.map(t => {
        const active = activeId === t.id;
        return (
          <button
            key={t.id}
            onClick={() => navigate(t.path)}
            style={{
              flex: 1, border: 'none', background: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '6px 0', color: active ? 'var(--navy)' : 'var(--faint)',
            }}
          >
            <div style={{
              width: 56, height: 30, borderRadius: 999,
              background: active ? 'var(--surface-alt)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background .2s',
            }}>
              <Icon name={t.icon} size={22} stroke={active ? 2.3 : 1.9} />
            </div>
            <span style={{ fontSize: 11, fontWeight: active ? 600 : 500 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
