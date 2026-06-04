import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLibro } from '../services/api';
import { autoresStr } from '../utils/autores';
import { AppBarBack } from '../components/AppBar';
import Cover from '../components/Cover';
import Icon from '../components/Icon';

export default function DetalleLibro() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [libro, setLibro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getLibro(id)
      .then(({ data }) => setLibro(data))
      .catch(() => setError('No se pudo cargar el libro.'))
      .finally(() => setLoading(false));
  }, [id]);



  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <AppBarBack title="Detalle del libro" onBack={() => navigate('/catalogo')} />

      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--faint)', fontSize: 14 }}>
          Cargando…
        </div>
      ) : error ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--no)', fontSize: 14 }}>
          {error}
        </div>
      ) : libro ? (
        <>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {/* Hero navy */}
            <div style={{ background: 'var(--navy)', padding: '8px 22px 28px', display: 'flex', gap: 18 }}>
              <div style={{ boxShadow: '0 12px 28px rgba(0,0,0,.32)', borderRadius: 9 }}>
                <Cover bookId={libro.id} available={(libro.copias_disponibles ?? 0) > 0} h={150} w={112} radius={9} />
              </div>
              <div style={{ flex: 1, minWidth: 0, color: '#fff', display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 6 }}>
                <div style={{ fontFamily: 'Lora, serif', fontSize: 21, fontWeight: 600, lineHeight: 1.22 }}>
                  {libro.titulo}
                </div>
                <div style={{ fontSize: 13.5, opacity: .82 }}>
                  {autoresStr(libro.autores)}
                </div>
                {(libro.categoria?.descripcion || libro.categoria?.nombre || libro.categoria) && (
                  <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'rgba(255,255,255,.12)', color: '#fff',
                      padding: '4px 10px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                    }}>
                      {libro.categoria?.descripcion ?? libro.categoria?.nombre ?? libro.categoria}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Tarjeta de disponibilidad */}
            {(() => {
              const disp = libro.copias_disponibles ?? 0;
              const total = libro.total_copias ?? libro.copias_totales ?? disp;
              const ok = disp > 0;
              return (
                <div style={{ padding: '16px 16px 0' }}>
                  <div style={{
                    background: ok ? 'var(--ok-bg)' : 'var(--no-bg)',
                    border: `1px solid ${ok ? 'var(--ok)' : 'var(--no)'}44`,
                    borderRadius: 14, padding: '14px 16px',
                    display: 'flex', alignItems: 'center', gap: 14,
                  }}>
                    <Icon name="copies" size={26} color={ok ? 'var(--ok)' : 'var(--no)'} stroke={1.9} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <span style={{
                          fontFamily: 'Lora, serif', fontSize: 26, fontWeight: 700,
                          color: ok ? 'var(--ok)' : 'var(--no)',
                        }}>
                          {disp}
                        </span>
                        <span style={{ fontSize: 13, color: 'var(--muted)' }}>de {total} ejemplares</span>
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: ok ? 'var(--ok)' : 'var(--no)' }}>
                        {ok ? 'Disponible para préstamo' : 'Sin ejemplares disponibles'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Ficha técnica */}
            <div style={{ padding: '18px 16px 24px' }}>
              <div style={{
                fontFamily: 'Lora, serif', fontSize: 15, fontWeight: 600,
                color: 'var(--ink)', marginBottom: 8,
              }}>
                Ficha técnica
              </div>
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 14, overflow: 'hidden',
              }}>
                {[
                  ['Editorial', libro.editorial?.nombre ?? libro.editorial],
                  ['Categoría', libro.categoria?.descripcion ?? libro.categoria?.nombre ?? libro.categoria],
                  ['Tipo', libro.tipo?.nombre ?? libro.tipo],
                  ['Año', libro.anio ?? libro.año],
                  ['ISBN', libro.isbn],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v], i) => (
                    <div key={k} style={{
                      display: 'flex', justifyContent: 'space-between', gap: 12,
                      padding: '12px 15px',
                      borderTop: i ? '1px solid var(--border)' : 'none',
                    }}>
                      <span style={{ fontSize: 13, color: 'var(--muted)' }}>{k}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', textAlign: 'right' }}>
                        {String(v)}
                      </span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          {/* CTA fija */}
          <div style={{
            flexShrink: 0, padding: '12px 16px 18px',
            background: 'var(--surface)', borderTop: '1px solid var(--border)',
          }}>
            <button
              disabled={!(libro.copias_disponibles > 0)}
              style={{
                width: '100%', height: 52, border: 'none', borderRadius: 13,
                cursor: libro.copias_disponibles > 0 ? 'pointer' : 'not-allowed',
                background: libro.copias_disponibles > 0 ? 'var(--navy)' : 'var(--surface-alt)',
                color: libro.copias_disponibles > 0 ? '#fff' : 'var(--faint)',
                fontSize: 15.5, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
              }}
            >
              <Icon name="bookmark" size={19} stroke={2} />
              {libro.copias_disponibles > 0 ? 'Reservar ejemplar' : 'No disponible'}
            </button>
          </div>
        </>
      ) : null}
    </div>
  );
}
