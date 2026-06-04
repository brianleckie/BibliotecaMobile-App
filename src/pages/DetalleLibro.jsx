import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLibro } from '../services/api';
import Navbar from '../components/Navbar';

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/catalogo')}
          className="flex items-center gap-1 text-[#1e3a5f] text-sm hover:underline mb-6"
        >
          ← Volver al catálogo
        </button>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Cargando...</div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">{error}</div>
        ) : libro ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h1 className="text-2xl font-bold text-[#1e3a5f] leading-snug mb-2">
              {libro.titulo}
            </h1>

            <p className="text-gray-600 text-sm mb-6">
              {Array.isArray(libro.autores)
                ? libro.autores.map((a) => `${a.nombres ?? ''} ${a.apellidos ?? ''}`.trim() || a.nombre || a).join(', ')
                : libro.autores ?? '—'}
            </p>

            {/* Copias disponibles — destacado */}
            {(() => {
              const disp = libro.copias_disponibles ?? 0;
              const disponible = disp > 0;
              return (
                <div
                  className={`rounded-xl p-5 mb-6 text-center ${
                    disponible ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <div
                    className={`text-5xl font-extrabold ${
                      disponible ? 'text-[#22c55e]' : 'text-[#ef4444]'
                    }`}
                  >
                    {disp}
                  </div>
                  <div
                    className={`text-sm font-medium mt-1 ${
                      disponible ? 'text-green-700' : 'text-red-600'
                    }`}
                  >
                    {disponible ? 'copias disponibles' : 'Sin ejemplares disponibles'}
                  </div>
                </div>
              );
            })()}

            {/* Datos del libro */}
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {libro.editorial && (
                <>
                  <dt className="text-gray-500 font-medium">Editorial</dt>
                  <dd className="text-gray-800">{libro.editorial?.nombre ?? libro.editorial}</dd>
                </>
              )}
              {libro.categoria && (
                <>
                  <dt className="text-gray-500 font-medium">Categoría</dt>
                  <dd className="text-gray-800">{libro.categoria?.descripcion ?? libro.categoria?.nombre ?? libro.categoria}</dd>
                </>
              )}
              {libro.tipo && (
                <>
                  <dt className="text-gray-500 font-medium">Tipo</dt>
                  <dd className="text-gray-800">{libro.tipo?.nombre ?? libro.tipo}</dd>
                </>
              )}
              {libro.anio && (
                <>
                  <dt className="text-gray-500 font-medium">Año</dt>
                  <dd className="text-gray-800">{libro.anio}</dd>
                </>
              )}
              {libro.isbn && (
                <>
                  <dt className="text-gray-500 font-medium">ISBN</dt>
                  <dd className="text-gray-800">{libro.isbn}</dd>
                </>
              )}
            </dl>
          </div>
        ) : null}
      </div>
    </div>
  );
}
