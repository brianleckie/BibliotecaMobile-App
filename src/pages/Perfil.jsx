import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPerfil } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-[#1e3a5f] mb-5">Mi Perfil</h2>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Cargando...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-2xl font-bold">
                {perfil?.nombre?.[0]?.toUpperCase() ??
                  perfil?.first_name?.[0]?.toUpperCase() ??
                  perfil?.username?.[0]?.toUpperCase() ??
                  '?'}
              </div>
            </div>

            <dl className="space-y-3 text-sm">
              {(perfil?.nombre || perfil?.first_name) && (
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <dt className="text-gray-500 font-medium">Nombre</dt>
                  <dd className="text-gray-800 font-semibold">
                    {perfil.nombre ??
                      `${perfil.first_name ?? ''} ${perfil.last_name ?? ''}`.trim()}
                  </dd>
                </div>
              )}
              {perfil?.username && (
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <dt className="text-gray-500 font-medium">Usuario</dt>
                  <dd className="text-gray-800">{perfil.username}</dd>
                </div>
              )}
              {(perfil?.carnet || perfil?.numero_carnet) && (
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <dt className="text-gray-500 font-medium">Carnet</dt>
                  <dd className="text-gray-800">{perfil.carnet ?? perfil.numero_carnet}</dd>
                </div>
              )}
              {perfil?.email && (
                <div className="flex justify-between pb-1">
                  <dt className="text-gray-500 font-medium">Email</dt>
                  <dd className="text-gray-800">{perfil.email}</dd>
                </div>
              )}
            </dl>

            <button
              onClick={cerrarSesion}
              className="mt-6 w-full py-2.5 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
