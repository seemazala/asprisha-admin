import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Messages from './pages/Messages';
import Settings from './pages/Settings';

// Protected route — redirect to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#070d1f', color: '#0dcfcf', fontSize: '1rem',
    }}>
      Loading...
    </div>
  );
  return admin ? children : <Navigate to="/login" replace />;
};

// Public route — redirect to dashboard if already logged in
const PublicRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) return null;
  return !admin ? children : <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0d1530',
              color: '#f0f4ff',
              border: '1px solid rgba(13,207,207,0.2)',
              fontSize: '0.88rem',
            },
            success: { iconTheme: { primary: '#0dcfcf', secondary: '#070d1f' } },
            error: { iconTheme: { primary: '#e63946', secondary: '#fff' } },
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}