import { Outlet, Link, useNavigate } from 'react-router-dom';
import './App.css';

export default function App() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('is_admin') === 'true';
  const access = localStorage.getItem('access');
  const isLoggedIn = !!access;

  function handleLogout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('is_admin');
    navigate('/');
  }

  return (
    <div className="app">
      <nav style={{
        backgroundColor: '#1976d2',
        color: 'white',
        padding: '15px 30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <Link 
            to="/" 
            style={{
              color: 'white',
              textDecoration: 'none',
              fontSize: '24px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            🎫 Ticketing System
          </Link>
        </div>

        {/* Right Side - Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {isLoggedIn ? (
            <>
              <Link 
                to={isAdmin ? '/admin/tickets' : '/tickets'}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  transition: 'background-color 0.3s',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                {isAdmin ? '📊 Dashboard' : '📋 My Tickets'}
              </Link>

              {!isAdmin && (
                <Link 
                  to="/tickets/create"
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    transition: 'background-color 0.3s',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  ➕ Create Ticket
                </Link>
              )}

              <div style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {isAdmin ? '👨‍💼 Admin' : '👤 User'}
              </div>

              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#d32f2f'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#f44336'}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  transition: 'background-color 0.3s',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                🏠 Home
              </Link>
              <Link 
                to="/login"
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  transition: 'background-color 0.3s',
                  fontWeight: 'bold'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
              >
                🔐 Login
              </Link>
            </>
          )}
        </div>
      </nav>

      <main style={{
        flex: 1,
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%'
      }}>
        <Outlet />
      </main>

      <footer style={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
        textAlign: 'center',
        color: '#666',
        fontSize: '14px',
        borderTop: '1px solid #ddd'
      }}>
        <p style={{ margin: '0 0 5px 0' }}>
          © 2025 Madaar Solutions - Ticketing System
        </p>
        <p style={{ margin: 0, fontSize: '12px' }}>
          Need help? Contact support at <a href="mailto:support@madaar.tn" style={{ color: '#1976d2' }}>support@madaar.tn</a>
        </p>
      </footer>
    </div>
  );
}
