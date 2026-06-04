import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLibros } from '../services/api';
import Navbar from '../components/Navbar';

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export default function Catalogo() {
  const [busqueda, setBusqueda] = useState('');
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const navigate = useNavigate();

  const debouncedBusqueda = useDebounce(busqueda, 400);

  const fetchLibros = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page };
      if (debouncedBusqueda) params.q = debouncedBusqueda;
      if (soloDisponibles) params.solo_disponibles = true;
      const { data } = await getLibros(params);
      const results = data.results ?? data;
      setLibros(Array.isArray(results) ? results : []);
      setHasNext(!!data.next);
      setHasPrev(!!data.previous);
    } catch {
      setError('No se pudieron cargar los libros.');
    } finally {
      setLoading(false);
    }
  }, [debouncedBusqueda, soloDisponibles, page]);

  useEffect(() => {
    setPage(1);
  }, [debouncedBusqueda, soloDisponibles]);

  useEffect(() => {
    fetchLibros();
  }, [fetchLibros]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-[#1e3a5f] mb-5">Catálogo de libros</h2>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por título, autor..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
          />
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={soloDisponibles}
              onChange={(e) => setSoloDisponibles(e.target.checked)}
              className="w-4 h-4 accent-[#1e3a5f]"
            />
            Solo disponibles
          </label>
        </div>

        {/* Contenido */}
        {loading ? (
          <div className="text-center py-16 text-gray-500">Cargando...</div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : libros.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No se encontraron libros.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {libros.map((libro) => {
                const disponible = libro.copias_disponibles > 0;
                return (
                  <button
                    key={libro.id}
                    onClick={() => navigate(`/libro/${libro.id}`)}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-left hover:shadow-md hover:border-[#1e3a5f]/30 transition-all cursor-pointer"
                  >
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">
                        {libro.titulo}
                      </h3>
                      <span
                        className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${
                          disponible
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {disponible ? 'Disponible' : 'No disponible'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {Array.isArray(libro.autores)
                        ? libro.autores.map((a) => a.nombre ?? a).join(', ')
                        : libro.autores ?? ''}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Paginación */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={!hasPrev}
                className="px-4 py-2 rounded-lg bg-[#1e3a5f] text-white text-sm disabled:opacity-40 hover:bg-[#16304f] transition-colors"
              >
                ← Anterior
              </button>
              <span className="text-sm text-gray-600">Página {page}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNext}
                className="px-4 py-2 rounded-lg bg-[#1e3a5f] text-white text-sm disabled:opacity-40 hover:bg-[#16304f] transition-colors"
              >
                Siguiente →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
