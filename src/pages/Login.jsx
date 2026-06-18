import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Fill in all fields.');
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back, Seema! 👋');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#070d1f',
      fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ width: '100%', maxWidth: '420px', padding: '0 1.5rem' }}>

        {/* ── Logo ── */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>

          {/* Logo image — column layout same as frontend */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginBottom: '0.75rem' }}>
            <img
              src="/logo.png"
              alt="AISPL Logo"
              style={{
                width: '72px',
                height: '72px',
                objectFit: 'contain',
                background: 'transparent',
                mixBlendMode: 'screen',
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback if logo not found */}
            <div style={{
              display: 'none', width: '72px', height: '72px', borderRadius: '16px',
              background: 'linear-gradient(135deg, #0a9a9a, #0dcfcf)',
              alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
            }}>⚡</div>

            {/* AISPL text */}
            <div style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '1.3rem',
              color: '#0dcfcf', letterSpacing: '0.12em', lineHeight: 1,
            }}>AISPL</div>

            {/* Company name */}
            <div style={{
              fontSize: '0.48rem', color: '#0dcfcf',
              letterSpacing: '0.06em', textTransform: 'uppercase',
              opacity: 0.85, lineHeight: 1.3, textAlign: 'center',
            }}>
              Asprisha Innovation Solutions Pvt. Ltd.
            </div>
          </div>

          <p style={{ color: '#8892b0', fontSize: '0.85rem' }}>
            Admin Panel
          </p>
        </div>

        {/* ── Card ── */}
        <div style={{
          background: '#111827', border: '1px solid rgba(13,207,207,0.18)',
          borderRadius: '16px', padding: '2rem', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: 'linear-gradient(90deg, transparent, #0dcfcf, transparent)',
          }} />

          <h2 style={{ color: '#f0f4ff', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', color: '#8892b0', fontSize: '0.78rem', marginBottom: '6px', letterSpacing: '0.05em' }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                placeholder="seemazala0422@gmail.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{
                  width: '100%', background: '#070d1f', border: '1px solid rgba(13,207,207,0.18)',
                  borderRadius: '8px', padding: '11px 14px', color: '#f0f4ff',
                  fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#0dcfcf'}
                onBlur={e => e.target.style.borderColor = 'rgba(13,207,207,0.18)'}
              />
            </div>

            <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <label style={{ display: 'block', color: '#8892b0', fontSize: '0.78rem', marginBottom: '6px', letterSpacing: '0.05em' }}>
                PASSWORD
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                style={{
                  width: '100%', background: '#070d1f', border: '1px solid rgba(13,207,207,0.18)',
                  borderRadius: '8px', padding: '11px 44px 11px 14px', color: '#f0f4ff',
                  fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#0dcfcf'}
                onBlur={e => e.target.style.borderColor = 'rgba(13,207,207,0.18)'}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{
                position: 'absolute', right: '12px', bottom: '11px',
                background: 'none', border: 'none', color: '#8892b0',
                cursor: 'pointer', fontSize: '1rem', padding: 0,
              }}>{showPass ? '🙈' : '👁️'}</button>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', background: loading ? '#0a9a9a' : '#0dcfcf',
              color: '#070d1f', border: 'none', borderRadius: '8px',
              padding: '12px', fontWeight: 700, fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
            }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: '#8892b0', fontSize: '0.78rem', marginTop: '1.5rem' }}>
          © 2026 Asprisha Innovation Solutions Pvt. Ltd.
        </p>
      </div>
    </div>
  );
}