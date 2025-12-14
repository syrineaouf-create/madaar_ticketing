import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import TicketsPage from './pages/TicketsPage';
import CreateTicketPage from './pages/CreateTicketPage';
import TicketDetailPage from './pages/TicketDetailPage';
import AdminTicketsPage from './pages/AdminTicketsPage';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />

          {/* User Routes */}
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="tickets/create" element={<CreateTicketPage />} />
          <Route path="tickets/:id" element={<TicketDetailPage />} />

          {/* Admin Routes */}
          <Route path="admin/tickets" element={<AdminTicketsPage />} />

          {/* 404 Not Found Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);



export default function NotFoundPage() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div style={{ fontSize: '80px', marginBottom: '20px' }}>🔍</div>
      <h1 style={{ 
        fontSize: '48px', 
        color: '#1976d2',
        marginBottom: '10px'
      }}>
        404
      </h1>
      <h2 style={{ 
        fontSize: '24px', 
        color: '#666',
        marginBottom: '20px'
      }}>
        Page Not Found
      </h2>
      <p style={{ 
        fontSize: '16px', 
        color: '#999',
        marginBottom: '30px',
        maxWidth: '400px'
      }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <a 
        href="/"
        style={{
          backgroundColor: '#1976d2',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '4px',
          textDecoration: 'none',
          fontSize: '16px',
          fontWeight: 'bold',
          transition: 'background-color 0.3s'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = '#1565c0'}
        onMouseLeave={(e) => e.target.style.backgroundColor = '#1976d2'}
      >
        ← Back to Home
      </a>
    </div>
  );
}
