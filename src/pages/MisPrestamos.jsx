import { useState, useEffect } from 'react';
import { getMisPrestamos } from '../services/api';
import Navbar from '../components/Navbar';

const ESTADO_CONFIG = {
  PENDIENTE: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-700' },
  ENTREGADO: { label: 'Entregado', className: 'bg-green-100 text-green-700' },
  VENCIDO:   { label: 'Vencido',   className: 'bg-red-100 text-red-600' },
};

export default function MisPrestamos() {
  const [prestamos, setPrestamos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMisPrestamos()
      .then(({ data }) => {
        const list = data.results ?? data;
        setPrestamos(Array.isArray(list) ? list : []);
      })
      .catch(() => setError('No se pudieron cargar los préstamos.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-[#1e3a5f] mb-5">Mis Préstamos</h2>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Cargando...</div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : prestamos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center text-gray-500">
            No tenés préstamos activos.
          </div>
        ) : (
          <div className="space-y-3">
            {prestamos.map((p) => {
              const estado = p.estado?.toUpperCase() ?? 'PENDIENTE';
              const cfg = ESTADO_CONFIG[estado] ?? ESTADO_CONFIG.PENDIENTE;
              const titulo =
                p.libro?.titulo ??
                p.material?.titulo ??
                p.titulo ??
                'Sin título';
              const fecha = p.fecha_inicio ?? p.fecha_prestamo ?? '—';
              return (
                <div
                  key={p.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex justify-between items-start gap-4"
                >
                  <div>
                    <p className="font-semibold text-gray-900 text-sm leading-snug">
                      {titulo}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Inicio: {fecha}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.className}`}
                  >
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
