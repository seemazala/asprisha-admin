import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all'); // all | unread | replied

  const fetchMessages = async () => {
    try {
      const res = await API.get('/contact');
      setMessages(res.data.contacts || []);
    } catch {
      toast.error('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const openMessage = async (msg) => {
    setSelected(msg);
    if (!msg.isRead) {
      try {
        await API.patch(`/contact/${msg._id}/read`);
        setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, isRead: true } : m));
      } catch {}
    }
  };

  const handleMarkReplied = async (id) => {
    try {
      await API.patch(`/contact/${id}/replied`);
      toast.success('Marked as replied!');
      setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true, isReplied: true } : m));
      if (selected?._id === id) setSelected(prev => ({ ...prev, isRead: true, isReplied: true }));
    } catch {
      toast.error('Failed to update.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await API.delete(`/contact/${id}`);
      toast.success('Message deleted.');
      setMessages(prev => prev.filter(m => m._id !== id));
      if (selected?._id === id) setSelected(null);
    } catch {
      toast.error('Failed to delete.');
    }
  };

  const filtered = messages.filter(m => {
    if (filter === 'unread') return !m.isRead;
    if (filter === 'replied') return m.isReplied;
    return true;
  });

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <Layout unreadCount={unreadCount}>
      <div style={{ maxWidth: '1100px' }}>

        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ color: '#f0f4ff', fontSize: '1.6rem', fontWeight: 700, marginBottom: '4px' }}>Messages</h1>
          <p style={{ color: '#8892b0', fontSize: '0.88rem' }}>
            {messages.length} total · {unreadCount} unread
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
          {[
            { key: 'all', label: `All (${messages.length})` },
            { key: 'unread', label: `Unread (${unreadCount})` },
            { key: 'replied', label: `Replied (${messages.filter(m => m.isReplied).length})` },
          ].map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
              padding: '7px 16px', borderRadius: '20px', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s',
              background: filter === tab.key ? '#0dcfcf' : 'rgba(13,207,207,0.08)',
              color: filter === tab.key ? '#070d1f' : '#8892b0',
              border: `1px solid ${filter === tab.key ? '#0dcfcf' : 'rgba(13,207,207,0.15)'}`,
            }}>{tab.label}</button>
          ))}
        </div>

        {/* Two-panel layout */}
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.4fr' : '1fr', gap: '1.5rem' }}>

          {/* Messages List */}
          <div style={{ background: '#111827', border: '1px solid rgba(13,207,207,0.18)', borderRadius: '12px', overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#8892b0' }}>Loading...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#8892b0' }}>No messages found.</div>
            ) : filtered.map(msg => (
              <div key={msg._id} onClick={() => openMessage(msg)} style={{
                padding: '1rem 1.25rem', borderBottom: '1px solid rgba(13,207,207,0.06)',
                cursor: 'pointer', transition: 'background 0.2s',
                background: selected?._id === msg._id
                  ? 'rgba(13,207,207,0.08)'
                  : !msg.isRead ? 'rgba(13,207,207,0.03)' : 'transparent',
              }}
                onMouseEnter={e => { if (selected?._id !== msg._id) e.currentTarget.style.background = 'rgba(13,207,207,0.04)'; }}
                onMouseLeave={e => { if (selected?._id !== msg._id) e.currentTarget.style.background = !msg.isRead ? 'rgba(13,207,207,0.03)' : 'transparent'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {!msg.isRead && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0dcfcf', display: 'inline-block', flexShrink: 0 }} />}
                    <span style={{ color: '#f0f4ff', fontWeight: msg.isRead ? 400 : 600, fontSize: '0.88rem' }}>{msg.name}</span>
                  </div>
                  <span style={{ color: '#8892b0', fontSize: '0.72rem' }}>
                    {new Date(msg.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div style={{ color: '#8892b0', fontSize: '0.78rem', marginBottom: '3px' }}>
                  {msg.email}
                </div>
                <div style={{ color: '#8892b0', fontSize: '0.78rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {msg.message}
                </div>
                <div style={{ marginTop: '6px', display: 'flex', gap: '6px' }}>
                  {msg.service && (
                    <span style={{ background: 'rgba(13,207,207,0.1)', color: '#0dcfcf', padding: '2px 8px', borderRadius: '10px', fontSize: '0.68rem' }}>
                      {msg.service}
                    </span>
                  )}
                  {msg.isReplied && (
                    <span style={{ background: 'rgba(46,196,182,0.1)', color: '#2ec4b6', padding: '2px 8px', borderRadius: '10px', fontSize: '0.68rem' }}>
                      ✓ Replied
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Message Detail */}
          {selected && (
            <div style={{ background: '#111827', border: '1px solid rgba(13,207,207,0.18)', borderRadius: '12px', padding: '1.5rem', position: 'relative' }}>
              <button onClick={() => setSelected(null)} style={{
                position: 'absolute', top: '1rem', right: '1rem',
                background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer', fontSize: '1.2rem',
              }}>✕</button>

              {/* Sender Info */}
              <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(13,207,207,0.12)' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0a9a9a, #0dcfcf)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#070d1f', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem',
                }}>
                  {selected.name.charAt(0).toUpperCase()}
                </div>
                <h3 style={{ color: '#f0f4ff', fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>{selected.name}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  <a href={`mailto:${selected.email}`} style={{ color: '#0dcfcf', fontSize: '0.82rem', textDecoration: 'none' }}>{selected.email}</a>
                  {selected.phone && <span style={{ color: '#8892b0', fontSize: '0.82rem' }}>📞 {selected.phone}</span>}
                  {selected.service && <span style={{ color: '#8892b0', fontSize: '0.82rem' }}>🔧 {selected.service}</span>}
                  <span style={{ color: '#8892b0', fontSize: '0.78rem' }}>
                    📅 {new Date(selected.createdAt).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Message */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ color: '#8892b0', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Message</div>
                <p style={{ color: '#f0f4ff', fontSize: '0.9rem', lineHeight: 1.7, background: 'rgba(13,207,207,0.04)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(13,207,207,0.1)' }}>
                  {selected.message}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <a href={`mailto:${selected.email}?subject=Re: Your inquiry at AISPL`} style={{
                  background: '#0dcfcf', color: '#070d1f', textDecoration: 'none',
                  padding: '9px 18px', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem',
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                }}>
                  📧 Reply via Email
                </a>
                {!selected.isReplied && (
                  <button onClick={() => handleMarkReplied(selected._id)} style={{
                    background: 'rgba(46,196,182,0.1)', color: '#2ec4b6',
                    border: '1px solid rgba(46,196,182,0.3)', padding: '9px 18px',
                    borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem',
                  }}>
                    ✓ Mark as Replied
                  </button>
                )}
                <button onClick={() => handleDelete(selected._id)} style={{
                  background: 'rgba(230,57,70,0.1)', color: '#e63946',
                  border: '1px solid rgba(230,57,70,0.2)', padding: '9px 18px',
                  borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem',
                }}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}