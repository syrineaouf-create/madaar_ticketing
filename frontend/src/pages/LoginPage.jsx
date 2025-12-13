import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();   // pour savoir si on vient de /?role=admin ou user
  const role = searchParams.get('role') || 'user';

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('status =', response.status);

      if (!response.ok) {
        const text = await response.text();
        console.log('body =', text);
        setError('Identifiants invalides');
        return;
      }

      const data = await response.json();
      console.log('data =', data);
      localStorage.setItem('access', data.access);
      localStorage.setItem('refresh', data.refresh);

      // détection admin par email
      const isAdmin = email.endsWith('@madaar.tn');
      localStorage.setItem('is_admin', isAdmin ? 'true' : 'false');

      // redirection selon rôle
      if (isAdmin) {
        navigate('/admin/tickets');
      } else {
        navigate('/tickets');
      }
    } catch (err) {
      console.error(err);
      setError('Erreur réseau');
    }
  }

  return (
    <div>
      <h2>Connexion {role === 'admin' ? 'admin' : 'utilisateur'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Se connecter</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
