import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    async function fetchTickets() {
      setError('');
      const token = localStorage.getItem('access');
      if (!token) {
        setError('You must be logged in to view your tickets.');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:8000/api/tickets/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setError('Error loading tickets.');
          return;
        }

        const data = await response.json();
        setTickets(data.results || []);
      } catch (err) {
        console.error(err);
        setError('Network error');
      }
    }

    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    const matchSearch = ticket.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  return (
    <div className="tickets-page" style={{ padding: '20px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <h2>My Tickets</h2>
        <Link to="/tickets/create">
          <button style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}>
            + Create Ticket
          </button>
        </Link>
      </div>

      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px'
      }}>
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
        
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            minWidth: '150px'
          }}
        >
          <option value="all">All Statuses</option>
          <option value="New">New</option>
          <option value="Under Review">Under Review</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            minWidth: '150px'
          }}
        >
          <option value="all">All Categories</option>
          <option value="Technical">Technical</option>
          <option value="Financial">Financial</option>
          <option value="Product">Product</option>
        </select>
      </div>

      {error && (
        <p style={{ 
          color: 'red', 
          padding: '10px', 
          backgroundColor: '#ffebee', 
          borderRadius: '4px' 
        }}>
          {error}
        </p>
      )}
      
      {filteredTickets.length === 0 && !error && (
        <p style={{ 
          textAlign: 'center', 
          color: '#666', 
          padding: '20px' 
        }}>
          No tickets found.
        </p>
      )}

      {filteredTickets.length > 0 && (
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0
        }}>
          {filteredTickets.map((ticket) => (
            <li key={ticket.id} style={{
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '15px',
              marginBottom: '10px',
              backgroundColor: 'white',
              transition: 'box-shadow 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
            >
              <Link 
                to={`/tickets/${ticket.id}`}
                style={{
                  textDecoration: 'none',
                  color: '#333',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong style={{ fontSize: '16px', color: '#1976d2' }}>
                    #{ticket.id} — {ticket.title}
                  </strong>
                  <div style={{ marginTop: '5px', fontSize: '14px', color: '#666' }}>
                    <span style={{ marginRight: '15px' }}>
                      📁 {ticket.category}
                    </span>
                    {ticket.priority && (
                      <span style={{ marginRight: '15px' }}>
                        ⚡ {ticket.priority}
                      </span>
                    )}
                  </div>
                </div>
                <span style={{
                  padding: '5px 15px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  backgroundColor: ticket.status === 'Resolved' ? '#4CAF50' : 
                                   ticket.status === 'Under Review' ? '#FF9800' : '#2196F3',
                  color: 'white'
                }}>
                  {ticket.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {filteredTickets.length > 0 && (
        <p style={{ 
          marginTop: '20px', 
          textAlign: 'center', 
          color: '#666', 
          fontSize: '14px' 
        }}>
          Showing {filteredTickets.length} ticket(s) out of {tickets.length} total
        </p>
      )}
    </div>
  );
}
