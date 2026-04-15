import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import Loading from './components/common/Loading';
import Navbar from './components/common/Navbar';
import Login from './components/common/Login';

// Import pages
import AdminDashboard from './pages/AdminDashboard';
import AdminWorks from './pages/AdminWorks';
import AdminEmployees from './pages/AdminEmployees';
import AdminReports from './pages/AdminReports';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeWorks from './pages/EmployeeWorks';
import EmployeeReports from './pages/EmployeeReports';

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, isAdmin, isEmployee, loading } = useAuth();

  if (loading) {
    return <Loading text="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate to="/employee/dashboard" replace />;
  }

  if (requiredRole === 'employee' && !isEmployee) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

// Redirect authenticated users
const AuthRedirect = () => {
  const { isAuthenticated, isAdmin, isEmployee, loading } = useAuth();

  if (loading) {
    return <Loading text="Loading..." />;
  }

  if (isAuthenticated) {
    if (isAdmin) {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (isEmployee) {
      return <Navigate to="/employee/dashboard" replace />;
    }
  }

  return <Login />;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div style={styles.app}>
            <Routes>
            {/* Public routes */}
<Route path="/login" element={<Login />} />            
            {/* Admin routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute requiredRole="admin">
                <>
                  <Navbar />
                  <div style={styles.content}>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="works" element={<AdminWorks />} />
                      <Route path="employees" element={<AdminEmployees />} />
                      <Route path="reports" element={<AdminReports />} />
                      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                    </Routes>
                  </div>
                </>
              </ProtectedRoute>
            } />

            {/* Employee routes */}
            <Route path="/employee/*" element={
              <ProtectedRoute requiredRole="employee">
                <>
                  <Navbar />
                  <div style={styles.content}>
                    <Routes>
                      <Route path="dashboard" element={<EmployeeDashboard />} />
                      <Route path="works" element={<EmployeeWorks />} />
                      <Route path="reports" element={<EmployeeReports />} />
                      <Route path="*" element={<Navigate to="/employee/dashboard" replace />} />
                    </Routes>
                  </div>
                </>
              </ProtectedRoute>
            } />

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  },
  content: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%'
  }
};

export default App;