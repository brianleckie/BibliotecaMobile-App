import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategorias } from '../services/api';
import { AppBar } from '../components/AppBar';
import BottomNav from '../components/BottomNav';
import Icon from '../components/Icon';

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getCategorias()
      .then(({ data }) => {
        const list = data.results ?? data;
        setCategorias(Array.isArray(list) ? list : []);
      })
      .catch(() => setError('No se pudieron cargar las categorías.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ height: 'var(--page-h)', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <div style={{ background: 'var(--navy)', flexShrink: 0 }}>
        <AppBar />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, padding: '18px 16px 20px' }}>
        <div style={{
          fontFamily: 'Lora, serif', fontSize: 20, fontWeight: 600,
          color: 'var(--ink)', marginBottom: 4,
        }}>
          Categorías
        </div>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
          Explorá el catálogo por categoría
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--faint)', fontSize: 14 }}>
            Cargando…
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--no)', fontSize: 14 }}>
            {error}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {categorias.map(c => (
              <button
                key={c.id}
                onClick={() => navigate(`/catalogo?categoria_id=${c.id}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 14, padding: '16px',
                  textAlign: 'left', cursor: 'pointer',
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: 'var(--navy)', opacity: .9,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon name="book" size={20} color="#fff" stroke={1.8} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: 'Lora, serif', fontSize: 15.5, fontWeight: 600,
                    color: 'var(--ink)', lineHeight: 1.25,
                  }}>
                    {c.descripcion ?? c.nombre}
                  </div>
                  {c.descripcion && c.nombre && c.descripcion !== c.nombre && (
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                      {c.nombre}
                    </div>
                  )}
                </div>
                <Icon name="chevron" size={18} color="var(--faint)" stroke={2} />
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
