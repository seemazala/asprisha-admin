import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { path: '/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/projects', icon: '🗂️', label: 'Projects' },
  { path: '/messages', icon: '📩', label: 'Messages' },
  { path: '/settings', icon: '⚙️', label: 'Settings' },
];

export default function Layout({ children, unreadCount = 0 }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out.');
    navigate('/login');
  };

  const SidebarContent = () => (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      padding: '1.25rem 0',
    }}>
      {/* Logo */}
      <div style={{
        padding: '0 1.25rem 1.5rem',
        borderBottom: '1px solid rgba(13,207,207,0.12)',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
          background: 'linear-gradient(135deg, #0a9a9a, #0dcfcf)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem',
        }}>⚡</div>
        {!collapsed && (
          <div>
            <div style={{ color: '#f0f4ff', fontWeight: 700, fontSize: '0.95rem' }}>AISPL Admin</div>
            <div style={{ color: '#0dcfcf', fontSize: '0.62rem', letterSpacing: '0.1em' }}>ASPRISHA INNOVATION</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <button key={item.path} onClick={() => { navigate(item.path); setMobileOpen(false); }} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: collapsed ? '10px' : '10px 12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderRadius: '8px', border: 'none', cursor: 'pointer',
              background: active ? 'rgba(13,207,207,0.15)' : 'transparent',
              color: active ? '#0dcfcf' : '#8892b0',
              fontWeight: active ? 600 : 400, fontSize: '0.88rem',
              transition: 'all 0.2s', position: 'relative',
              borderLeft: active ? '2px solid #0dcfcf' : '2px solid transparent',
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(13,207,207,0.07)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && item.label === 'Messages' && unreadCount > 0 && (
                <span style={{
                  marginLeft: 'auto', background: '#0dcfcf', color: '#070d1f',
                  borderRadius: '10px', padding: '1px 7px', fontSize: '0.72rem', fontWeight: 700,
                }}>{unreadCount}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Admin Info + Logout */}
      <div style={{
        padding: '1rem 0.75rem',
        borderTop: '1px solid rgba(13,207,207,0.12)',
      }}>
        {!collapsed && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 12px', marginBottom: '8px',
            background: 'rgba(13,207,207,0.05)', borderRadius: '8px',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #0a9a9a, #0dcfcf)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#070d1f', fontWeight: 700, fontSize: '0.85rem',
            }}>SZ</div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: '#f0f4ff', fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {admin?.name || 'Seema Zala'}
              </div>
              <div style={{ color: '#8892b0', fontSize: '0.7rem' }}>Director</div>
            </div>
          </div>
        )}
        <button onClick={handleLogout} style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: '8px', padding: '9px 12px', borderRadius: '8px',
          background: 'transparent', border: '1px solid rgba(255,80,80,0.2)',
          color: '#ff6b6b', cursor: 'pointer', fontSize: '0.85rem',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,80,80,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <span>🚪</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#070d1f', fontFamily: "'Inter', sans-serif" }}>
      {/* Desktop Sidebar */}
      <aside style={{
        width: collapsed ? '64px' : '220px',
        background: '#0d1530', borderRight: '1px solid rgba(13,207,207,0.12)',
        transition: 'width 0.25s ease', flexShrink: 0, position: 'fixed',
        top: 0, left: 0, bottom: 0, zIndex: 100, overflowX: 'hidden',
      }} className="desktop-sidebar">
        <button onClick={() => setCollapsed(!collapsed)} style={{
          position: 'absolute', top: '1rem', right: '-12px', zIndex: 101,
          width: '24px', height: '24px', borderRadius: '50%',
          background: '#0d1530', border: '1px solid rgba(13,207,207,0.3)',
          color: '#0dcfcf', cursor: 'pointer', fontSize: '0.7rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{collapsed ? '›' : '‹'}</button>
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: '56px', zIndex: 200,
        background: '#0d1530', borderBottom: '1px solid rgba(13,207,207,0.12)',
        display: 'flex', alignItems: 'center', padding: '0 1rem',
        justifyContent: 'space-between',
      }} className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.2rem' }}>⚡</span>
          <span style={{ color: '#f0f4ff', fontWeight: 700, fontSize: '0.95rem' }}>AISPL Admin</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{
          background: 'none', border: 'none', color: '#0dcfcf', fontSize: '1.3rem', cursor: 'pointer',
        }}>{mobileOpen ? '✕' : '☰'}</button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 150 }}>
          <div onClick={() => setMobileOpen(false)} style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
          }} />
          <aside style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: '220px',
            background: '#0d1530', borderRight: '1px solid rgba(13,207,207,0.12)', zIndex: 151,
          }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginLeft: collapsed ? '64px' : '220px',
        padding: '2rem',
        minHeight: '100vh',
        transition: 'margin-left 0.25s ease',
      }} className="main-content">
        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-header { display: flex !important; }
          .main-content { margin-left: 0 !important; padding-top: 72px !important; }
        }
        @media (min-width: 769px) {
          .mobile-header { display: none !important; }
        }
      `}</style>
    </div>
  );
}