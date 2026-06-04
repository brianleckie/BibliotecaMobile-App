import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Catalogo from './pages/Catalogo';
import DetalleLibro from './pages/DetalleLibro';
import Autores from './pages/Autores';
import Categorias from './pages/Categorias';
import MisPrestamos from './pages/MisPrestamos';
import Perfil from './pages/Perfil';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/catalogo" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Rutas públicas */}
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/libro/:id" element={<DetalleLibro />} />
          <Route path="/autores" element={<Autores />} />
          <Route path="/categorias" element={<Categorias />} />

          {/* Rutas privadas */}
          <Route
            path="/mis-prestamos"
            element={
              <ProtectedRoute message="Iniciá sesión para ver tus préstamos.">
                <MisPrestamos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute message="Iniciá sesión para ver tu perfil.">
                <Perfil />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/catalogo" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
