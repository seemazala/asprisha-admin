import { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function Settings() {
  const { admin } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [showPass, setShowPass] = useState({ cur: false, new: false, con: false });

  const inputStyle = {
    width: '100%', background: '#070d1f', border: '1px solid rgba(13,207,207,0.2)',
    borderRadius: '8px', padding: '11px 40px 11px 14px', color: '#f0f4ff',
    fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s',
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword)
      return toast.error('Please fill all fields.');
    if (form.newPassword.length < 6)
      return toast.error('New password must be at least 6 characters.');
    if (form.newPassword !== form.confirmPassword)
      return toast.error('New passwords do not match.');
    setSaving(true);
    try {
      await API.put('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success('Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setSaving(false);
    }
  };

  const PassInput = ({ label, field, showKey }) => (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', color: '#8892b0', fontSize: '0.75rem', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={showPass[showKey] ? 'text' : 'password'}
          value={form[field]}
          onChange={e => setForm({ ...form, [field]: e.target.value })}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = '#0dcfcf'}
          onBlur={e => e.target.style.borderColor = 'rgba(13,207,207,0.2)'}
        />
        <button type="button" onClick={() => setShowPass(p => ({ ...p, [showKey]: !p[showKey] }))} style={{
          position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
          background: 'none', border: 'none', color: '#8892b0', cursor: 'pointer', fontSize: '1rem',
        }}>
          {showPass[showKey] ? '🙈' : '👁️'}
        </button>
      </div>
    </div>
  );

  return (
    <Layout>
      <div style={{ maxWidth: '700px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ color: '#f0f4ff', fontSize: '1.6rem', fontWeight: 700, marginBottom: '4px' }}>Settings</h1>
          <p style={{ color: '#8892b0', fontSize: '0.88rem' }}>Manage your admin account.</p>
        </div>

        {/* Profile Card */}
        <div style={{
          background: '#111827', border: '1px solid rgba(13,207,207,0.18)',
          borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem',
          display: 'flex', alignItems: 'center', gap: '1.25rem',
        }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #0a9a9a, #0dcfcf)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#070d1f', fontWeight: 700, fontSize: '1.4rem',
            border: '2px solid rgba(13,207,207,0.3)',
          }}>SZ</div>
          <div>
            <div style={{ color: '#f0f4ff', fontWeight: 700, fontSize: '1rem' }}>{admin?.name || 'Seema Zala'}</div>
            <div style={{ color: '#0dcfcf', fontSize: '0.8rem', marginTop: '2px' }}>Director · AISPL Admin</div>
            <div style={{ color: '#8892b0', fontSize: '0.78rem', marginTop: '2px' }}>{admin?.email}</div>
          </div>
        </div>

        {/* Change Password */}
        <div style={{
          background: '#111827', border: '1px solid rgba(13,207,207,0.18)',
          borderRadius: '12px', padding: '1.75rem', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, transparent, #0dcfcf, transparent)' }} />
          <h2 style={{ color: '#f0f4ff', fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>
            🔐 Change Password
          </h2>
          <form onSubmit={handleChangePassword}>
            <PassInput label="Current Password" field="currentPassword" showKey="cur" />
            <PassInput label="New Password" field="newPassword" showKey="new" />
            <PassInput label="Confirm New Password" field="confirmPassword" showKey="con" />
            <button type="submit" disabled={saving} style={{
              marginTop: '0.5rem', background: saving ? '#0a9a9a' : '#0dcfcf',
              color: '#070d1f', border: 'none', borderRadius: '8px', padding: '12px 24px',
              cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.9rem',
              transition: 'all 0.2s',
            }}>
              {saving ? 'Saving...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Company Info */}
        <div style={{
          background: '#111827', border: '1px solid rgba(13,207,207,0.18)',
          borderRadius: '12px', padding: '1.75rem', marginTop: '1.5rem',
        }}>
          <h2 style={{ color: '#f0f4ff', fontWeight: 700, fontSize: '1rem', marginBottom: '1.25rem' }}>
            🏢 Company Details
          </h2>
          {[
            { label: 'Company Name', value: 'Asprisha Innovation Solutions Pvt. Ltd.' },
            { label: 'CIN', value: 'U74999GJ2017PTC100177' },
            { label: 'Registration Date', value: '18 December 2017' },
            { label: 'Status', value: 'Active & Compliant' },
            { label: 'Location', value: '40, Digvijay Plot, Jamnagar, Gujarat – 361005' },
          ].map(item => (
            <div key={item.label} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              padding: '0.75rem 0', borderBottom: '1px solid rgba(13,207,207,0.08)',
              gap: '1rem',
            }}>
              <span style={{ color: '#8892b0', fontSize: '0.82rem', flexShrink: 0 }}>{item.label}</span>
              <span style={{ color: '#f0f4ff', fontSize: '0.82rem', textAlign: 'right' }}>{item.value}</span>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}