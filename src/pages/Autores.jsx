import { useState, useEffect, useCallback } from 'react';
import { getAutores } from '../services/api';
import { AppBar } from '../components/AppBar';
import BottomNav from '../components/BottomNav';
import Icon from '../components/Icon';

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function Autores() {
  const [busqueda, setBusqueda] = useState('');
  const [autores, setAutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [total, setTotal] = useState(0);

  const debouncedBusqueda = useDebounce(busqueda, 400);

  const fetchAutores = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page };
      if (debouncedBusqueda) params.q = debouncedBusqueda;
      const { data } = await getAutores(params);
      const results = data.results ?? data;
      setAutores(Array.isArray(results) ? results : []);
      setHasNext(!!data.next);
      setHasPrev(!!data.previous);
      setTotal(data.count ?? (Array.isArray(results) ? results.length : 0));
    } catch {
      setError('No se pudieron cargar los autores.');
    } finally {
      setLoading(false);
    }
  }, [debouncedBusqueda, page]);

  useEffect(() => { setPage(1); }, [debouncedBusqueda]);
  useEffect(() => { fetchAutores(); }, [fetchAutores]);

  const nombreCompleto = (a) =>
    `${a.nombres ?? a.nombre ?? ''} ${a.apellidos ?? ''}`.trim() || '—';

  return (
    <div style={{ height: 'var(--page-h)', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* AppBar navy con buscador */}
      <div style={{ background: 'var(--navy)', flexShrink: 0 }}>
        <AppBar />
        <div style={{ padding: '0 16px 14px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 9,
            background: '#fff', borderRadius: 12, padding: '0 13px', height: 46,
          }}>
            <Icon name="search" size={19} color="var(--faint)" stroke={2} />
            <input
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
              placeholder="Buscar autor por nombre…"
              style={{
                flex: 1, border: 'none', outline: 'none', background: 'none',
                fontSize: 14.5, color: 'var(--ink)',
              }}
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}
              >
                <Icon name="x" size={16} color="var(--faint)" stroke={2.2} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {/* Conteo */}
        <div style={{ padding: '14px 16px 10px' }}>
          <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>
            {loading ? '…' : `${total} autor${total !== 1 ? 'es' : ''}`}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px 20px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--faint)', fontSize: 14 }}>
              Cargando…
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--no)', fontSize: 14 }}>
              {error}
            </div>
          ) : autores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--faint)' }}>
              <Icon name="user" size={34} color="var(--faint)" stroke={1.5} />
              <div style={{ marginTop: 10, fontSize: 14 }}>No se encontraron autores.</div>
            </div>
          ) : (
            autores.map(a => {
              const pais = a.pais?.nombre ?? a.pais ?? a.nacionalidad ?? '';
              const anio = a.anio_nacimiento ?? a.fecha_nacimiento?.slice(0, 4) ?? '';
              return (
                <div
                  key={a.id}
                  style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 14, padding: '14px 16px',
                    display: 'flex', alignItems: 'center', gap: 14,
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 999, flexShrink: 0,
                    background: 'var(--surface-alt)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon name="user" size={20} color="var(--navy)" stroke={1.9} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'Lora, serif', fontSize: 15.5, fontWeight: 600,
                      color: 'var(--ink)', lineHeight: 1.25,
                    }}>
                      {nombreCompleto(a)}
                    </div>
                    <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 3 }}>
                      {[pais, anio].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Paginación */}
        {!loading && !error && autores.length > 0 && (
          <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            gap: 16, padding: '0 16px 24px',
          }}>
            <button
              onClick={() => setPage(p => p - 1)}
              disabled={!hasPrev}
              style={{
                padding: '8px 18px', borderRadius: 10, border: 'none',
                background: hasPrev ? 'var(--navy)' : 'var(--surface-alt)',
                color: hasPrev ? '#fff' : 'var(--faint)',
                fontSize: 13, fontWeight: 600, cursor: hasPrev ? 'pointer' : 'default',
              }}
            >
              ← Anterior
            </button>
            <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>Página {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!hasNext}
              style={{
                padding: '8px 18px', borderRadius: 10, border: 'none',
                background: hasNext ? 'var(--navy)' : 'var(--surface-alt)',
                color: hasNext ? '#fff' : 'var(--faint)',
                fontSize: 13, fontWeight: 600, cursor: hasNext ? 'pointer' : 'default',
              }}
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
