import { Link } from 'react-router-dom';

export default function HomePage() {
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
        padding: '60px 40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        
        <div style={{
          fontSize: '64px',
          marginBottom: '20px'
        }}>
          🎫
        </div>

        
        <h1 style={{
          margin: '0 0 15px 0',
          color: '#1976d2',
          fontSize: '36px',
          fontWeight: 'bold'
        }}>
          Welcome to Ticketing System
        </h1>

        <p style={{
          margin: '0 0 40px 0',
          color: '#666',
          fontSize: '18px'
        }}>
          Choose your space to get started
        </p>

        
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>

          <Link to="/login?role=user" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#2196F3',
              color: 'white',
              padding: '20px 40px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 2px 8px rgba(33,150,243,0.3)',
              minWidth: '200px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1976d2';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(33,150,243,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2196F3';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(33,150,243,0.3)';
            }}
            >
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>👤</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>I am a User</div>
              <div style={{ fontSize: '13px', marginTop: '5px', opacity: 0.9 }}>
                Submit and manage tickets
              </div>
            </div>
          </Link>

         
          <Link to="/login?role=admin" style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: '#FF9800',
              color: 'white',
              padding: '20px 40px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 2px 8px rgba(255,152,0,0.3)',
              minWidth: '200px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F57C00';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255,152,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FF9800';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(255,152,0,0.3)';
            }}
            >
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>👨‍💼</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold' }}>I am an Admin</div>
              <div style={{ fontSize: '13px', marginTop: '5px', opacity: 0.9 }}>
                Manage all tickets
              </div>
            </div>
          </Link>
        </div>

       
        <div style={{
          marginTop: '40px',
          padding: '20px',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#1976d2'
        }}>
          <strong>ℹ️ Note:</strong> Admin accounts must use <strong>@madaar.tn</strong> email domain
        </div>

        
        <div style={{
          marginTop: '30px',
          textAlign: 'left',
          color: '#666',
          fontSize: '14px'
        }}>
          <p style={{ fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>
            ✨ Features:
          </p>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0,
            margin: 0
          }}>
            <li style={{ marginBottom: '8px' }}>✓ Submit support tickets with attachments</li>
            <li style={{ marginBottom: '8px' }}>✓ Track ticket status in real-time</li>
            <li style={{ marginBottom: '8px' }}>✓ Filter and search tickets</li>
            <li style={{ marginBottom: '8px' }}>✓ Admin dashboard with full control</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
