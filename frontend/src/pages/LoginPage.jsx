import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login/Register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'user';

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError('Invalid credentials');
        setLoading(false);
        return;
      }

      const data = await response.json();
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);

      const isAdmin = email.endsWith('@madaar.tn');
      localStorage.setItem('is_admin', isAdmin ? 'true' : 'false');

      if (isAdmin) {
        navigate('/admin/tickets');
      } else {
        navigate('/tickets');
      }
    } catch (err) {
      console.error(err);
      setError('Network error');
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          password2: confirmPassword, // si ton serializer l’attend
          username: username || email.split('@')[0],
        }),
      });

      if (!response.ok) {
        let message = 'Registration failed';
        try {
          const errorData = await response.json();
          message = errorData.email?.[0] || errorData.password?.[0] || message;
        } catch {
          message = 'Server error (check backend console).';
        }
        setError(message);
        setLoading(false);
        return;
      }

      setSuccess('Registration successful! You can now login.');
      setLoading(false);

      setTimeout(() => {
        setIsLogin(true);
        setPassword('');
        setConfirmPassword('');
        setUsername('');
        setSuccess('');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('Network error');
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{
            margin: '0 0 10px 0',
            color: '#1976d2',
            fontSize: '28px'
          }}>
            {isLogin
              ? (role === 'admin' ? 'Admin Login' : 'User Login')
              : 'Create Account'
            }
          </h2>
          <p style={{
            margin: 0,
            color: '#666',
            fontSize: '14px'
          }}>
            {isLogin
              ? `Sign in to access your ${role === 'admin' ? 'admin dashboard' : 'tickets'}`
              : 'Register a new account to get started'
            }
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '25px',
          backgroundColor: '#f5f5f5',
          padding: '5px',
          borderRadius: '4px'
        }}>
          <button
            onClick={() => {
              setIsLogin(true);
              setError('');
              setSuccess('');
            }}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: isLogin ? '#1976d2' : 'transparent',
              color: isLogin ? 'white' : '#666',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError('');
              setSuccess('');
            }}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: !isLogin ? '#1976d2' : 'transparent',
              color: !isLogin ? 'white' : '#666',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.3s'
            }}
          >
            Register
          </button>
        </div>

        {success && (
          <div style={{
            color: '#2e7d32',
            backgroundColor: '#e8f5e9',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'center',
            border: '1px solid #a5d6a7'
          }}>
            ✓ {success}
          </div>
        )}

        {error && (
          <div style={{
            color: '#d32f2f',
            backgroundColor: '#ffebee',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'center',
            border: '1px solid #ffcdd2'
          }}>
            ⚠️ {error}
          </div>
        )}

        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...buttonStyle,
                backgroundColor: loading ? '#ccc' : '#1976d2'
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="At least 6 characters"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={labelStyle}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter your password"
                style={inputStyle}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...buttonStyle,
                backgroundColor: loading ? '#ccc' : '#4CAF50'
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        )}

        <div style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: '#e3f2fd',
          borderRadius: '4px',
          fontSize: '13px',
          color: '#1976d2',
          textAlign: 'center'
        }}>
          {isLogin
            ? (role === 'admin'
              ? '👤 Admin accounts must use @madaar.tn email'
              : '👤 Regular user login'
            )
            : '👤 After registration, you can login immediately'
          }
        </div>

        <div style={{
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              backgroundColor: 'transparent',
              color: '#1976d2',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              textDecoration: 'underline'
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  color: '#333',
  fontSize: '14px',
  fontWeight: 'bold'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '14px',
  boxSizing: 'border-box',
  transition: 'border-color 0.3s'
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  transition: 'background-color 0.3s'
};
