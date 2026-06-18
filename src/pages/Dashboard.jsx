import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import API from '../api/axios';
import toast from 'react-hot-toast';

const StatCard = ({ icon, label, value, sub, color = '#0dcfcf' }) => (
  <div style={{
    background: '#111827', border: '1px solid rgba(13,207,207,0.18)',
    borderRadius: '12px', padding: '1.5rem', position: 'relative', overflow: 'hidden',
  }}>
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{ color: '#8892b0', fontSize: '0.78rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
        <div style={{ color: '#f0f4ff', fontSize: '2rem', fontWeight: 700 }}>{value}</div>
        {sub && <div style={{ color: '#8892b0', fontSize: '0.75rem', marginTop: '4px' }}>{sub}</div>}
      </div>
      <div style={{ fontSize: '2rem', opacity: 0.8 }}>{icon}</div>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, messages: 0, unread: 0, active: 0 });
  const [recentMessages, setRecentMessages] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, msgRes] = await Promise.all([
          API.get('/projects/admin/all'),
          API.get('/contact'),
        ]);
        const projects = projRes.data.projects || [];
        const messages = msgRes.data.contacts || [];
        setStats({
          projects: projects.length,
          active: projects.filter(p => p.isActive).length,
          messages: messages.length,
          unread: msgRes.data.unreadCount || 0,
        });
        setRecentMessages(messages.slice(0, 4));
        setRecentProjects(projects.slice(0, 4));
      } catch (err) {
        toast.error('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Layout unreadCount={stats.unread}>
      <div style={{ maxWidth: '1100px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: '#f0f4ff', fontSize: '1.6rem', fontWeight: 700, marginBottom: '4px' }}>
            Welcome back, Seema! 👋
          </h1>
          <p style={{ color: '#8892b0', fontSize: '0.9rem' }}>
            Here's what's happening with your website.
          </p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          <StatCard icon="🗂️" label="Total Projects" value={loading ? '...' : stats.projects} sub={`${stats.active} active`} />
          <StatCard icon="📩" label="Total Messages" value={loading ? '...' : stats.messages} sub="Contact form" color="#f4a261" />
          <StatCard icon="🔴" label="Unread Messages" value={loading ? '...' : stats.unread} sub="Need attention" color="#e63946" />
          <StatCard icon="✅" label="Active Projects" value={loading ? '...' : stats.active} sub="Live on site" color="#2ec4b6" />
        </div>

        {/* Two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>

          {/* Recent Projects */}
          <div style={{ background: '#111827', border: '1px solid rgba(13,207,207,0.18)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(13,207,207,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#f0f4ff', fontWeight: 600, fontSize: '0.95rem' }}>Recent Projects</h3>
              <button onClick={() => navigate('/projects')} style={{ background: 'none', border: 'none', color: '#0dcfcf', cursor: 'pointer', fontSize: '0.8rem' }}>
                View All →
              </button>
            </div>
            <div style={{ padding: '0.5rem 0' }}>
              {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#8892b0' }}>Loading...</div>
              ) : recentProjects.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#8892b0' }}>No projects yet.</div>
              ) : recentProjects.map((p) => (
                <div key={p._id} style={{ padding: '0.9rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(13,207,207,0.06)' }}>
                  <div>
                    <div style={{ color: '#f0f4ff', fontSize: '0.88rem', fontWeight: 500 }}>{p.title}</div>
                    <div style={{ color: '#8892b0', fontSize: '0.75rem', marginTop: '2px' }}>{p.category}</div>
                  </div>
                  <span style={{
                    background: p.isActive ? 'rgba(46,196,182,0.15)' : 'rgba(136,146,176,0.15)',
                    color: p.isActive ? '#2ec4b6' : '#8892b0',
                    padding: '3px 10px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600,
                  }}>
                    {p.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Messages */}
          <div style={{ background: '#111827', border: '1px solid rgba(13,207,207,0.18)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(13,207,207,0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#f0f4ff', fontWeight: 600, fontSize: '0.95rem' }}>
                Recent Messages
                {stats.unread > 0 && (
                  <span style={{ marginLeft: '8px', background: '#e63946', color: '#fff', borderRadius: '10px', padding: '1px 7px', fontSize: '0.7rem' }}>
                    {stats.unread} new
                  </span>
                )}
              </h3>
              <button onClick={() => navigate('/messages')} style={{ background: 'none', border: 'none', color: '#0dcfcf', cursor: 'pointer', fontSize: '0.8rem' }}>
                View All →
              </button>
            </div>
            <div style={{ padding: '0.5rem 0' }}>
              {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#8892b0' }}>Loading...</div>
              ) : recentMessages.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: '#8892b0' }}>No messages yet.</div>
              ) : recentMessages.map((m) => (
                <div key={m._id} style={{
                  padding: '0.9rem 1.5rem', borderBottom: '1px solid rgba(13,207,207,0.06)',
                  background: !m.isRead ? 'rgba(13,207,207,0.04)' : 'transparent',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <div style={{ color: '#f0f4ff', fontSize: '0.88rem', fontWeight: m.isRead ? 400 : 600 }}>{m.name}</div>
                    {!m.isRead && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0dcfcf', display: 'inline-block', marginTop: '4px' }} />}
                  </div>
                  <div style={{ color: '#8892b0', fontSize: '0.75rem' }}>{m.service || 'General enquiry'}</div>
                  <div style={{ color: '#8892b0', fontSize: '0.72rem', marginTop: '2px' }}>
                    {new Date(m.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/projects')} style={{
            background: '#0dcfcf', color: '#070d1f', border: 'none', borderRadius: '8px',
            padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem',
          }}>
            + Add New Project
          </button>
          <button onClick={() => navigate('/messages')} style={{
            background: 'transparent', color: '#0dcfcf', border: '1px solid rgba(13,207,207,0.3)',
            borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
          }}>
            View Messages
          </button>
        </div>
      </div>
    </Layout>
  );
}