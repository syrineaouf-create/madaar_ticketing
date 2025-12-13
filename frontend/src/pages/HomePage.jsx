import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      <h2>Welcome to the ticketing system</h2>
      <p>Choose your space:</p>
      <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
        <Link to="/login?role=user">
          <button>I am a user</button>
        </Link>
        <Link to="/login?role=admin">
          <button>I am an admin</button>
        </Link>
      </div>
    </div>
  );
}
