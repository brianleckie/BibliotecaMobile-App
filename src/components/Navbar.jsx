import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-[#1e3a5f] text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-lg tracking-wide">📚 Biblioteca</span>
        <div className="flex gap-2 sm:gap-6 text-sm sm:text-base">
          <NavLink
            to="/catalogo"
            className={({ isActive }) =>
              `px-3 py-1 rounded transition-colors ${isActive ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'}`
            }
          >
            Catálogo
          </NavLink>
          <NavLink
            to="/mis-prestamos"
            className={({ isActive }) =>
              `px-3 py-1 rounded transition-colors ${isActive ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'}`
            }
          >
            Mis Préstamos
          </NavLink>
          <NavLink
            to="/perfil"
            className={({ isActive }) =>
              `px-3 py-1 rounded transition-colors ${isActive ? 'bg-white/20 font-semibold' : 'hover:bg-white/10'}`
            }
          >
            Perfil
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
