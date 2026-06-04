import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import escudo from '../assets/escudo.png';
import Icon from '../components/Icon';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { saveToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Ingresá tu usuario y contraseña.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data } = await login(username, password);
      saveToken(data.access, data.refresh);
      navigate('/catalogo');
    } catch {
      setError('Usuario o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      background: 'var(--navy)',
    }}>
      {/* Encabezado navy */}
      <div style={{
        padding: '42px 28px 38px',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 16, textAlign: 'center', color: '#fff',
      }}>
        <div style={{
          width: 76, height: 76, borderRadius: 999,
          background: '#fff', border: '1.5px solid rgba(255,255,255,.55)',
          boxShadow: '0 1px 4px rgba(0,0,0,.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
        }}>
          <img src={escudo} alt="Escudo C.T.N.E." style={{ width: '84%', height: '84%', objectFit: 'contain' }} />
        </div>
        <div>
          <div style={{ fontFamily: 'Lora, serif', fontSize: 25, fontWeight: 600, lineHeight: 1.2 }}>
            Biblioteca Escolar
          </div>
          <div style={{ fontSize: 12, opacity: .72, letterSpacing: '.12em', textTransform: 'uppercase', marginTop: 5 }}>
            Colegio Técnico Nacional
          </div>
        </div>
      </div>

      {/* Hoja blanca con formulario */}
      <div style={{
        flex: 1, background: 'var(--bg)',
        borderRadius: '26px 26px 0 0',
        padding: '30px 26px',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <div style={{ fontFamily: 'Lora, serif', fontSize: 21, fontWeight: 600, color: 'var(--ink)' }}>
          Iniciá sesión
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>Usuario</label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '0 14px', height: 52,
              }}>
                <Icon name="user" size={19} color="var(--faint)" stroke={1.9} />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Tu usuario o carnet"
                  autoFocus
                  style={{
                    flex: 1, border: 'none', outline: 'none', background: 'none',
                    fontSize: 15, color: 'var(--ink)',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--muted)' }}>Contraseña</label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '0 14px', height: 52,
              }}>
                <Icon name="lock" size={19} color="var(--faint)" stroke={1.9} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    flex: 1, border: 'none', outline: 'none', background: 'none',
                    fontSize: 15, color: 'var(--ink)',
                  }}
                />
              </div>
            </div>
          </div>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--no-bg)', color: 'var(--no)',
              borderRadius: 10, padding: '10px 12px',
              fontSize: 13, fontWeight: 500,
            }}>
              <Icon name="x" size={15} stroke={2.4} />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 4, height: 52, border: 'none', borderRadius: 12,
              cursor: loading ? 'not-allowed' : 'pointer',
              background: 'var(--navy)', color: '#fff',
              fontSize: 15.5, fontWeight: 600, letterSpacing: '.01em',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: loading ? .7 : 1,
            }}
          >
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <div style={{ flex: 1 }} />
        <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--faint)', paddingBottom: 6 }}>
          Acceso para estudiantes y docentes del C.T.N.E.
        </div>
      </div>
    </div>
  );
}
