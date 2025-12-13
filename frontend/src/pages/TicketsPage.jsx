import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTickets() {
      setError('');
      const token = localStorage.getItem('access');
      if (!token) {
        setError('Vous devez être connecté pour voir vos tickets.');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/tickets/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setError('Erreur lors du chargement des tickets.');
          return;
        }

        const data = await response.json();
        // data = { count, next, previous, results: [...] }
        setTickets(data.results || []);
      } catch (err) {
      console.error(err);
      setError('Erreur réseau');
    }
  }

    fetchTickets();
  }, []);

  return (
    <div>
      <h2>Mes tickets</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {tickets.length === 0 && !error && <p>Aucun ticket.</p>}
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id}>
             <Link to={`/tickets/${ticket.id}`}>
            #{ticket.id} — {ticket.title} ({ticket.status})
          </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
