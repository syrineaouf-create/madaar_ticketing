import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const STATUS_OPTIONS = ['Open', 'In Progress', 'Resolved', 'Closed'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];

export default function AdminTicketsPage() {
  // TOUS les hooks en haut
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const isAdmin = localStorage.getItem('is_admin') === 'true';

  useEffect(() => {
    async function fetchTickets() {
      setError('');
      setLoading(true);
      const token = localStorage.getItem('access');
      if (!token) {
        setError('Vous devez être connecté en administrateur.');
        setLoading(false);
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
          setLoading(false);
          return;
        }

        const data = await response.json();
        setTickets(data.results || []);
      } catch (e) {
        console.error(e);
        setError('Erreur réseau.');
      } finally {
        setLoading(false);
      }
    }

    if (isAdmin) {
      fetchTickets();
    } else {
      setLoading(false);
      setError("Vous n'avez pas le droit d'accéder à cette page.");
    }
  }, [isAdmin]);

  // contrôle d'accès après les hooks
  if (!isAdmin) {
    return (
      <div>
        <h2>Accès refusé</h2>
        <p>Vous devez être administrateur pour accéder à cette page.</p>
      </div>
    );
  }

  const filteredTickets = tickets.filter((t) => {
    const text = `${t.title || ''} ${t.description || ''}`.toLowerCase();
    const matchText = text.includes(search.toLowerCase());

    const matchStatus =
      statusFilter === 'all' ? true : t.status === statusFilter;

    const matchPriority =
      priorityFilter === 'all' ? true : t.priority === priorityFilter;

    return matchText && matchStatus && matchPriority;
  });

  async function handleStatusChange(id, newStatus) {
    const token = localStorage.getItem('access');
    if (!token) {
      alert('Token manquant, reconnectez-vous.');
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/tickets/${id}/updatestatus/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        alert("Error updating status.");
        return;
      }

      const updated = await response.json();

      setTickets((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
      );
    } catch (e) {
      console.error(e);
      alert('Network error during update.');
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Admin – All Tickets</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search (Title / Description)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        >
          <option value="all">Tous les statuts</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="all">Toutes les priorités</option>
          {PRIORITY_OPTIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {filteredTickets.length === 0 && !error && (
        <p>Aucun ticket ne correspond aux filtres.</p>
      )}

      {filteredTickets.length > 0 && (
        <table border="1" cellPadding="4" cellSpacing="0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>User</th>
              <th>Statut</th>
              <th>Priority</th>
              <th>Created on</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>
                  <Link to={`/tickets/${ticket.id}`}>{ticket.title}</Link>
                </td>
                <td>{ticket.created_by_username}</td>
                <td>{ticket.status}</td>
                <td>{ticket.priority}</td>
                <td>{ticket.created_at}</td>
                <td>
                  <select
                    value={ticket.status}
                    onChange={(e) =>
                      handleStatusChange(ticket.id, e.target.value)
                    }
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
