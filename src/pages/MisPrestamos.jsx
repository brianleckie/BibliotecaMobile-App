import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMisPrestamos } from '../services/api';
import { AppBar } from '../components/AppBar';
import BottomNav from '../components/BottomNav';
import Cover from '../components/Cover';
import Badge from '../components/Badge';
import Icon from '../components/Icon';

const ESTADO = {
  PENDIENTE: { kind: 'warn', label: 'Pendiente',  bar: 'var(--warn)' },
  ENTREGADO: { kind: 'ok',   label: 'Entregado',  bar: 'var(--ok)' },
  VENCIDO:   { kind: 'no',   label: 'Vencido',    bar: 'var(--no)' },
};

export default function MisPrestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getMisPrestamos()
      .then(({ data }) => {
        const list = data.results ?? data;
        setPrestamos(Array.isArray(list) ? list : []);
      })
      .catch(() => setError('No se pudieron cargar los préstamos.'))
      .finally(() => setLoading(false));
  }, []);

  const activos = prestamos.filter(p => (p.estado?.toUpperCase()) !== 'ENTREGADO');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <AppBar subtitle="Mis Préstamos" />

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--faint)', fontSize: 14 }}>
            Cargando…
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--no)', fontSize: 14 }}>
            {error}
          </div>
        ) : prestamos.length === 0 ? (
          /* Empty state */
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 14, padding: '60px 40px', textAlign: 'center',
          }}>
            <div style={{
              width: 76, height: 76, borderRadius: 999,
              background: 'var(--surface-alt)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="bookmark" size={32} color="var(--faint)" stroke={1.6} />
            </div>
            <div style={{ fontFamily: 'Lora, serif', fontSize: 18, fontWeight: 600, color: 'var(--ink)' }}>
              Todavía no tenés préstamos
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.5 }}>
              Cuando retires un libro de la biblioteca, vas a verlo acá con su fecha de vencimiento.
            </div>
            <button
              onClick={() => navigate('/catalogo')}
              style={{
                marginTop: 4, height: 46, padding: '0 22px',
                border: 'none', borderRadius: 12, cursor: 'pointer',
                background: 'var(--navy)', color: '#fff',
                fontSize: 14.5, fontWeight: 600,
              }}
            >
              Explorar el catálogo
            </button>
          </div>
        ) : (
          <div style={{ padding: '18px 16px 20px' }}>
            <div style={{ fontFamily: 'Lora, serif', fontSize: 20, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>
              Mis Préstamos
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
              {activos.length} activo{activos.length !== 1 ? 's' : ''} · {prestamos.length} en total
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {prestamos.map(p => {
                const estado = p.estado?.toUpperCase() ?? 'PENDIENTE';
                const cfg = ESTADO[estado] ?? ESTADO.PENDIENTE;
                const titulo = p.libro?.titulo ?? p.material?.titulo ?? p.titulo ?? 'Sin título';
                const autores = p.libro?.autores ?? p.autores ?? '';
                const autoresStr = Array.isArray(autores)
                  ? autores.map(a => a.nombres ? `${a.nombres} ${a.apellidos ?? ''}`.trim() : (a.nombre ?? '')).join(', ')
                  : String(autores);
                const vence = p.fecha_vencimiento ?? p.fecha_devolucion ?? p.fecha_fin ?? '';
                const libroId = p.libro?.id ?? p.libro_id;

                return (
                  <button
                    key={p.id}
                    onClick={() => libroId && navigate(`/libro/${libroId}`)}
                    style={{
                      display: 'flex', gap: 13, textAlign: 'left', cursor: libroId ? 'pointer' : 'default',
                      background: 'var(--surface)', border: '1px solid var(--border)',
                      borderRadius: 14, padding: 12,
                      position: 'relative', overflow: 'hidden',
                    }}
                  >
                    {/* Barra de color por estado */}
                    <span style={{
                      position: 'absolute', left: 0, top: 0, bottom: 0,
                      width: 4, background: cfg.bar,
                    }} />
                    <Cover bookId={libroId ?? p.id} available={estado !== 'VENCIDO'} h={82} w={60} radius={7} />
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ fontFamily: 'Lora, serif', fontSize: 15, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.25 }}>
                        {titulo}
                      </div>
                      {autoresStr && (
                        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{autoresStr}</div>
                      )}
                      {vence && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--faint)' }}>
                          <Icon name="cal" size={13} color="var(--faint)" stroke={1.8} />
                          Vence {vence}
                        </div>
                      )}
                      <div style={{ marginTop: 2 }}>
                        <Badge kind={cfg.kind}>{cfg.label}</Badge>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
