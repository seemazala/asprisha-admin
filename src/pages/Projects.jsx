import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import API from '../api/axios';
import toast from 'react-hot-toast';

const emptyForm = {
  title: '', subtitle: '', description: '',
  techStack: '', category: 'React.js',
  liveUrl: '', githubUrl: '',
  icon: '💻', color: '#0dcfcf',
  featured: true, order: 0,
};

const categories = ['MERN Stack', 'React.js', 'Client Work', 'Mobile App', 'Other'];
const icons = ['💻', '🛒', '🔍', '🌤️', '👩‍💻', '📱', '🏢', '⚙️', '🌐', '🎨', '📊', '🔧'];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects/admin/all');
      setProjects(res.data.projects || []);
    } catch {
      toast.error('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setForm({
      title: p.title, subtitle: p.subtitle, description: p.description,
      techStack: p.techStack.join(', '), category: p.category,
      liveUrl: p.liveUrl || '', githubUrl: p.githubUrl || '',
      icon: p.icon || '💻', color: p.color || '#0dcfcf',
      featured: p.featured, order: p.order || 0,
    });
    setEditingId(p._id);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.subtitle || !form.description || !form.techStack) {
      return toast.error('Please fill all required fields.');
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (editingId) {
        await API.put(`/projects/${editingId}`, payload);
        toast.success('Project updated!');
      } else {
        await API.post('/projects', payload);
        toast.success('Project added!');
      }
      setShowModal(false);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await API.patch(`/projects/${id}/toggle`);
      toast.success(res.data.message);
      fetchProjects();
    } catch {
      toast.error('Failed to toggle project.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/projects/${id}`);
      toast.success('Project deleted.');
      setDeleteConfirm(null);
      fetchProjects();
    } catch {
      toast.error('Failed to delete project.');
    }
  };

  const inputStyle = {
    width: '100%', background: '#070d1f', border: '1px solid rgba(13,207,207,0.2)',
    borderRadius: '8px', padding: '10px 12px', color: '#f0f4ff',
    fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif',
  };

  const labelStyle = { display: 'block', color: '#8892b0', fontSize: '0.75rem', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' };

  return (
    <Layout>
      <div style={{ maxWidth: '1100px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ color: '#f0f4ff', fontSize: '1.6rem', fontWeight: 700, marginBottom: '4px' }}>Projects</h1>
            <p style={{ color: '#8892b0', fontSize: '0.88rem' }}>{projects.length} total · {projects.filter(p => p.isActive).length} active</p>
          </div>
          <button onClick={openAdd} style={{
            background: '#0dcfcf', color: '#070d1f', border: 'none', borderRadius: '8px',
            padding: '10px 20px', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem',
          }}>
            + Add Project
          </button>
        </div>

        {/* Projects Table */}
        <div style={{ background: '#111827', border: '1px solid rgba(13,207,207,0.18)', borderRadius: '12px', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#8892b0' }}>Loading projects...</div>
          ) : projects.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#8892b0' }}>
              No projects yet. <button onClick={openAdd} style={{ color: '#0dcfcf', background: 'none', border: 'none', cursor: 'pointer' }}>Add one →</button>
            </div>
          ) : (
            <div>
              {/* Table Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '1rem', padding: '0.9rem 1.5rem', borderBottom: '1px solid rgba(13,207,207,0.12)', color: '#8892b0', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                <div>Project</div>
                <div>Category</div>
                <div>Status</div>
                <div>Live URL</div>
                <div>Actions</div>
              </div>

              {projects.map((p) => (
                <div key={p._id} style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
                  gap: '1rem', padding: '1rem 1.5rem', alignItems: 'center',
                  borderBottom: '1px solid rgba(13,207,207,0.06)',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(13,207,207,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Title */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.2rem' }}>{p.icon}</span>
                      <div>
                        <div style={{ color: '#f0f4ff', fontWeight: 600, fontSize: '0.88rem' }}>{p.title}</div>
                        <div style={{ color: '#8892b0', fontSize: '0.75rem' }}>{p.subtitle}</div>
                      </div>
                    </div>
                  </div>

                  {/* Category */}
                  <div style={{ color: '#8892b0', fontSize: '0.8rem' }}>{p.category}</div>

                  {/* Status Toggle */}
                  <div>
                    <button onClick={() => handleToggle(p._id)} style={{
                      background: p.isActive ? 'rgba(46,196,182,0.15)' : 'rgba(136,146,176,0.15)',
                      color: p.isActive ? '#2ec4b6' : '#8892b0',
                      border: `1px solid ${p.isActive ? 'rgba(46,196,182,0.3)' : 'rgba(136,146,176,0.2)'}`,
                      padding: '4px 12px', borderRadius: '20px', cursor: 'pointer',
                      fontSize: '0.75rem', fontWeight: 600,
                    }}>
                      {p.isActive ? '● Active' : '○ Hidden'}
                    </button>
                  </div>

                  {/* Live URL */}
                  <div>
                    {p.liveUrl ? (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0dcfcf', fontSize: '0.78rem', textDecoration: 'none' }}>
                        View Live ↗
                      </a>
                    ) : (
                      <span style={{ color: '#8892b0', fontSize: '0.78rem' }}>—</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => openEdit(p)} style={{
                      background: 'rgba(13,207,207,0.1)', border: '1px solid rgba(13,207,207,0.2)',
                      color: '#0dcfcf', padding: '6px 12px', borderRadius: '6px',
                      cursor: 'pointer', fontSize: '0.78rem',
                    }}>Edit</button>
                    <button onClick={() => setDeleteConfirm(p._id)} style={{
                      background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.2)',
                      color: '#e63946', padding: '6px 12px', borderRadius: '6px',
                      cursor: 'pointer', fontSize: '0.78rem',
                    }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Add/Edit Modal ── */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{
            background: '#0d1530', border: '1px solid rgba(13,207,207,0.2)', borderRadius: '16px',
            width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto',
            padding: '2rem', position: 'relative',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ color: '#f0f4ff', fontWeight: 700, fontSize: '1.1rem' }}>
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer', fontSize: '1.4rem' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Title *</label>
                  <input style={inputStyle} placeholder="e.g. Cartify" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Subtitle *</label>
                  <input style={inputStyle} placeholder="e.g. E-Commerce Platform" value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Description *</label>
                <textarea style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }} placeholder="Project description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              <div>
                <label style={labelStyle}>Tech Stack * (comma separated)</label>
                <input style={inputStyle} placeholder="React.js, Node.js, MongoDB, AWS" value={form.techStack} onChange={e => setForm({ ...form, techStack: e.target.value })} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Icon</label>
                  <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}>
                    {icons.map(i => <option key={i} value={i}>{i} {i}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Live URL</label>
                  <input style={inputStyle} placeholder="https://..." value={form.liveUrl} onChange={e => setForm({ ...form, liveUrl: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>GitHub URL</label>
                  <input style={inputStyle} placeholder="https://github.com/..." value={form.githubUrl} onChange={e => setForm({ ...form, githubUrl: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Accent Color</label>
                  <input type="color" style={{ ...inputStyle, padding: '4px', height: '40px', cursor: 'pointer' }} value={form.color} onChange={e => setForm({ ...form, color: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Display Order</label>
                  <input type="number" style={inputStyle} value={form.order} onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button onClick={handleSave} disabled={saving} style={{
                flex: 1, background: '#0dcfcf', color: '#070d1f', border: 'none',
                borderRadius: '8px', padding: '12px', cursor: saving ? 'not-allowed' : 'pointer',
                fontWeight: 700, fontSize: '0.9rem', opacity: saving ? 0.7 : 1,
              }}>
                {saving ? 'Saving...' : editingId ? 'Update Project' : 'Add Project'}
              </button>
              <button onClick={() => setShowModal(false)} style={{
                background: 'transparent', color: '#8892b0', border: '1px solid rgba(136,146,176,0.2)',
                borderRadius: '8px', padding: '12px 20px', cursor: 'pointer', fontSize: '0.9rem',
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#0d1530', border: '1px solid rgba(230,57,70,0.3)', borderRadius: '12px', padding: '2rem', maxWidth: '380px', width: '90%', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🗑️</div>
            <h3 style={{ color: '#f0f4ff', fontWeight: 700, marginBottom: '0.5rem' }}>Delete Project?</h3>
            <p style={{ color: '#8892b0', fontSize: '0.88rem', marginBottom: '1.5rem' }}>This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={() => handleDelete(deleteConfirm)} style={{ flex: 1, background: '#e63946', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', cursor: 'pointer', fontWeight: 700 }}>
                Delete
              </button>
              <button onClick={() => setDeleteConfirm(null)} style={{ flex: 1, background: 'transparent', color: '#8892b0', border: '1px solid rgba(136,146,176,0.2)', borderRadius: '8px', padding: '10px', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}