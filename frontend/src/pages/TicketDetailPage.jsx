import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';   
export default function TicketDetailPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTicket() {
      setError('');
      const token = localStorage.getItem('access');
      if (!token) {
        setError("Vous devez être connecté pour voir ce ticket.");
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/tickets/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setError("Erreur lors du chargement du ticket.");
          return;
        }

        const data = await response.json();
        setTicket(data);
      } catch {
        setError("Erreur réseau.");
      }
    }

    fetchTicket();
  }, [id]);

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!ticket) {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <h2>Ticket #{ticket.id}</h2>
      <p><strong>Titre :</strong> {ticket.title}</p>
      <p><strong>Description :</strong> {ticket.description}</p>
      <p><strong>Statut :</strong> {ticket.status}</p>
      <p><strong>Catégorie :</strong> {ticket.category}</p>
      <p><strong>Priorité :</strong> {ticket.priority}</p>
       <button onClick={() => navigate('/tickets')}>
        Retour à la liste
      </button>
    </div>
  );
}
