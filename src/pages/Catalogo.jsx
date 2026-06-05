import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getLibros, getCategorias } from '../services/api';
import { autoresStr } from '../utils/autores';
import { AppBar } from '../components/AppBar';
import BottomNav from '../components/BottomNav';
import Badge from '../components/Badge';
import Icon from '../components/Icon';

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// Paleta de colores para las iniciales de libros
const SPINE_COLORS = [
  '#1f3a5f', '#2f8f5b', '#7c3aed', '#0891b2',
  '#be185d', '#c98a12', '#b45309', '#0f766e',
];
const spineColor = (id) => SPINE_COLORS[id % SPINE_COLORS.length];

export default function Catalogo() {
  const [searchParams] = useSearchParams();
  const initialCatId = searchParams.get('categoria_id')
    ? Number(searchParams.get('categoria_id'))
    : null;

  const [busqueda, setBusqueda] = useState('');
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [categoriaId, setCategoriaId] = useState(initialCatId);
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  const debouncedBusqueda = useDebounce(busqueda, 400);

  useEffect(() => {
    getCategorias()
      .then(({ data }) => {
        const list = data.results ?? data;
        setCategorias(Array.isArray(list) ? list : []);
      })
      .catch(() => {});
  }, []);

  const fetchLibros = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page };
      if (debouncedBusqueda) params.q = debouncedBusqueda;
      if (soloDisponibles) params.solo_disponibles = 'true';
      if (categoriaId) params.categoria_id = categoriaId;
      const { data } = await getLibros(params);
      const results = data.results ?? data;
      setLibros(Array.isArray(results) ? results : []);
      setHasNext(!!data.next);
      setHasPrev(!!data.previous);
      setTotal(data.count ?? (Array.isArray(results) ? results.length : 0));
    } catch {
      setError('No se pudieron cargar los libros.');
    } finally {
      setLoading(false);
    }
  }, [debouncedBusqueda, soloDisponibles, categoriaId, page]);

  useEffect(() => { setPage(1); }, [debouncedBusqueda, soloDisponibles, categoriaId]);
  useEffect(() => { fetchLibros(); }, [fetchLibros]);

  return (
    <div style={{ height: 'var(--page-h)', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* AppBar navy con buscador integrado */}
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
              placeholder="Buscar por título, autor o ISBN…"
              style={{ flex: 1, border: 'none', outline: 'none', background: 'none', fontSize: 14.5, color: 'var(--ink)' }}
            />
            {busqueda && (
              <button onClick={() => setBusqueda('')} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 2, display: 'flex' }}>
                <Icon name="x" size={16} color="var(--faint)" stroke={2.2} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {/* Chips de categoría */}
        {categorias.length > 0 && (
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '14px 16px 10px', scrollbarWidth: 'none' }}>
            <button
              onClick={() => setCategoriaId(null)}
              style={{
                flexShrink: 0,
                border: `1px solid ${!categoriaId ? 'var(--navy)' : 'var(--border)'}`,
                background: !categoriaId ? 'var(--navy)' : 'var(--surface)',
                color: !categoriaId ? '#fff' : 'var(--muted)',
                borderRadius: 999, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Todos
            </button>
            {categorias.map(c => (
              <button
                key={c.id}
                onClick={() => setCategoriaId(c.id)}
                style={{
                  flexShrink: 0,
                  border: `1px solid ${categoriaId === c.id ? 'var(--navy)' : 'var(--border)'}`,
                  background: categoriaId === c.id ? 'var(--navy)' : 'var(--surface)',
                  color: categoriaId === c.id ? '#fff' : 'var(--muted)',
                  borderRadius: 999, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >
                {c.descripcion ?? c.nombre}
              </button>
            ))}
          </div>
        )}

        {/* Conteo + toggle solo disponibles */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: categorias.length > 0 ? '4px 16px 10px' : '14px 16px 10px',
        }}>
          <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>
            {loading ? '…' : `${total} resultado${total !== 1 ? 's' : ''}`}
          </span>
          <button
            onClick={() => setSoloDisponibles(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--ink)', fontSize: 13, fontWeight: 500 }}
          >
            Solo disponibles
            <span style={{
              width: 38, height: 22, borderRadius: 999, padding: 2, transition: 'background .2s',
              background: soloDisponibles ? 'var(--navy)' : 'var(--border)',
              display: 'flex', justifyContent: soloDisponibles ? 'flex-end' : 'flex-start',
            }}>
              <span style={{ width: 18, height: 18, borderRadius: 999, background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,.2)' }} />
            </span>
          </button>
        </div>

        {/* Lista / grid de libros */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--faint)', fontSize: 14 }}>Cargando…</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--no)', fontSize: 14 }}>{error}</div>
        ) : libros.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--faint)' }}>
            <Icon name="search" size={34} color="var(--faint)" stroke={1.5} />
            <div style={{ marginTop: 10, fontSize: 14 }}>Sin resultados para tu búsqueda.</div>
          </div>
        ) : (
          <div className="book-grid">
            {libros.map(libro => {
              const disp = (libro.copias_disponibles ?? 0) > 0;
              const color = spineColor(libro.id);
              const catLabel = libro.categoria?.descripcion ?? libro.categoria?.nombre ?? libro.categoria ?? '';
              const anio = libro.anio ?? libro.año ?? '';
              const inicial = (libro.titulo ?? '?')[0].toUpperCase();

              return (
                <button
                  key={libro.id}
                  onClick={() => navigate(`/libro/${libro.id}`)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                    cursor: 'pointer', background: 'var(--surface)',
                    border: '1px solid var(--border)', borderRadius: 14,
                    padding: '12px 12px 12px 16px',
                    position: 'relative', overflow: 'hidden',
                  }}
                >
                  {/* Barra lateral de color */}
                  <span style={{
                    position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
                    background: disp ? color : 'var(--no)',
                  }} />

                  {/* Inicial del título */}
                  <div style={{
                    width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                    background: disp ? `${color}18` : 'var(--no-bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{
                      fontFamily: 'Lora, serif', fontSize: 21, fontWeight: 700,
                      color: disp ? color : 'var(--no)', lineHeight: 1,
                    }}>
                      {inicial}
                    </span>
                  </div>

                  {/* Texto */}
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <div style={{ fontFamily: 'Lora, serif', fontSize: 14.5, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {libro.titulo}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      {autoresStr(libro.autores)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
                      {catLabel && (
                        <span style={{ fontSize: 10.5, color: 'var(--faint)' }}>
                          {[catLabel, anio].filter(Boolean).join(' · ')}
                        </span>
                      )}
                      <Badge kind={disp ? 'ok' : 'no'}>
                        {disp ? `${libro.copias_disponibles} disp.` : 'Prestado'}
                      </Badge>
                    </div>
                  </div>

                  <Icon name="chevron" size={16} color="var(--faint)" stroke={2} style={{ flexShrink: 0 }} />
                </button>
              );
            })}
          </div>
        )}

        {/* Paginación */}
        {!loading && !error && libros.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, padding: '8px 16px 24px' }}>
            <button
              onClick={() => setPage(p => p - 1)} disabled={!hasPrev}
              style={{ padding: '8px 18px', borderRadius: 10, border: 'none', background: hasPrev ? 'var(--navy)' : 'var(--surface-alt)', color: hasPrev ? '#fff' : 'var(--faint)', fontSize: 13, fontWeight: 600, cursor: hasPrev ? 'pointer' : 'default' }}
            >
              ← Anterior
            </button>
            <span style={{ fontSize: 12.5, color: 'var(--muted)' }}>Página {page}</span>
            <button
              onClick={() => setPage(p => p + 1)} disabled={!hasNext}
              style={{ padding: '8px 18px', borderRadius: 10, border: 'none', background: hasNext ? 'var(--navy)' : 'var(--surface-alt)', color: hasNext ? '#fff' : 'var(--faint)', fontSize: 13, fontWeight: 600, cursor: hasNext ? 'pointer' : 'default' }}
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
