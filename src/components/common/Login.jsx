import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from './Toast';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [isEmployee, setIsEmployee] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const { login, error, clearError } = useAuth();
  const { error: toastError, success } = useToast();

  // Handle login input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ LOGIN SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    setLoading(true);

    try {
      const result = await login(formData, isEmployee);

      success('Login successful!');

      // 🔥 Direct redirect based on role
      if (isEmployee) {
        navigate('/employee/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      toastError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>e-Sevai Login</h2>

        {/* ================= LOGIN FORM ================= */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div>
            <label>Login Type</label><br />
            <input
              type="radio"
              checked={!isEmployee}
              onChange={() => setIsEmployee(false)}
            /> Admin
            <input
              type="radio"
              checked={isEmployee}
              onChange={() => setIsEmployee(true)}
              style={{ marginLeft: "10px" }}
            /> Employee
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange}
            required
            style={styles.input}
          />

          {error && <p style={styles.error}>{error}</p>}

          <button disabled={loading} style={styles.button}>
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5"
  },
  card: {
    padding: 30,
    background: "#fff",
    borderRadius: 10,
    width: 320,
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  title: {
    marginBottom: 20
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12
  },
  input: {
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 5
  },
  otp: {
    padding: 12,
    fontSize: 20,
    textAlign: "center",
    letterSpacing: 5,
    border: "2px solid #007bff",
    borderRadius: 5
  },
  button: {
    padding: 10,
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer"
  },
  back: {
    marginTop: 10,
    padding: 8,
    border: "none",
    background: "#eee",
    cursor: "pointer"
  },
  error: {
    color: "red",
    fontSize: "14px"
  }
};

export default Login;