import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPerfil } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AppBar } from '../components/AppBar';
import BottomNav from '../components/BottomNav';
import Icon from '../components/Icon';

export default function Perfil() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const { clearToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getPerfil()
      .then(({ data }) => setPerfil(data))
      .finally(() => setLoading(false));
  }, []);

  const cerrarSesion = () => {
    clearToken();
    navigate('/login');
  };

  const nombre = (
    perfil?.nombre
    ?? (`${perfil?.first_name ?? ''} ${perfil?.last_name ?? ''}`.trim() || null)
    ?? perfil?.username
    ?? ''
  );

  const inicial = nombre?.[0]?.toUpperCase() ?? '?';

  const datos = [
    { icon: 'user', label: 'Nombre',  valor: nombre },
    { icon: 'at',   label: 'Usuario', valor: perfil?.username },
    { icon: 'card', label: 'Carnet',  valor: perfil?.carnet ?? perfil?.numero_carnet },
    { icon: 'book', label: 'Curso',   valor: perfil?.curso ?? perfil?.grado },
  ].filter(d => d.valor);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <AppBar subtitle="Perfil" />

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--faint)', fontSize: 14 }}>
            Cargando…
          </div>
        ) : (
          <>
            {/* Cabecera con avatar */}
            <div style={{
              background: 'var(--navy)', padding: '10px 20px 30px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 84, height: 84, borderRadius: 999,
                background: 'var(--gold)', color: 'var(--navy-deep)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Lora, serif', fontSize: 38, fontWeight: 700,
                border: '3px solid rgba(255,255,255,.25)',
              }}>
                {inicial}
              </div>
              <div style={{ textAlign: 'center', color: '#fff' }}>
                <div style={{ fontFamily: 'Lora, serif', fontSize: 20, fontWeight: 600 }}>{nombre}</div>
                {perfil?.email && (
                  <div style={{ fontSize: 12.5, opacity: .75, marginTop: 2 }}>{perfil.email}</div>
                )}
              </div>
            </div>

            {/* Mis datos */}
            <div style={{ padding: '18px 16px 20px' }}>
              <div style={{
                fontFamily: 'Lora, serif', fontSize: 15, fontWeight: 600,
                color: 'var(--ink)', marginBottom: 8,
              }}>
                Mis datos
              </div>

              {datos.length > 0 && (
                <div style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 14, overflow: 'hidden', marginBottom: 18,
                }}>
                  {datos.map(({ icon, label, valor }, i) => (
                    <div key={label} style={{
                      display: 'flex', alignItems: 'center', gap: 13,
                      padding: '13px 15px',
                      borderTop: i ? '1px solid var(--border)' : 'none',
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'var(--surface-alt)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Icon name={icon} size={18} color="var(--navy)" stroke={1.9} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11.5, color: 'var(--faint)', fontWeight: 500 }}>{label}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>{valor}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={cerrarSesion}
                style={{
                  width: '100%', height: 50,
                  border: '1px solid var(--no)', borderRadius: 13, cursor: 'pointer',
                  background: 'var(--no-bg)', color: 'var(--no)',
                  fontSize: 15, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                }}
              >
                <Icon name="logout" size={19} stroke={2} />
                Cerrar sesión
              </button>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
