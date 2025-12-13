import { Outlet, Link } from 'react-router-dom';
import './App.css';

export default function App() {
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  return (
    <div>
      <nav>
        <Link to="/">Accueil</Link>
        <Link to="/login">Login</Link>
        <Link to="/tickets">Mes tickets</Link>
        {isAdmin && <Link to="/admin/tickets">Admin</Link>}
      </nav>

      <div className="app-container">
        <Outlet />
      </div>
    </div>
  );
}
