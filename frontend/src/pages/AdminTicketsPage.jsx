import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const STATUS_OPTIONS = ['New', 'Under Review', 'Resolved'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];
const CATEGORY_OPTIONS = ['Technical', 'Financial', 'Product'];

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  useEffect(() => {
    async function fetchTickets() {
      setError('');
      setLoading(true);
      const token = localStorage.getItem('access');
      
      if (!token) {
        setError('You must be logged in as administrator.');
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
          setError('Error loading tickets.');
          setLoading(false);
          return;
        }

        const data = await response.json();
        setTickets(data.results || []);
      } catch (e) {
        console.error(e);
        setError('Network error.');
      } finally {
        setLoading(false);
      }
    }

    if (isAdmin) {
      fetchTickets();
    } else {
      setLoading(false);
      setError("You don't have permission to access this page.");
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2 style={{ color: 'red' }}>Access Denied</h2>
        <p>You must be an administrator to access this page.</p>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchSearch = 
      ticket.title.toLowerCase().includes(search.toLowerCase()) ||
      (ticket.created_by_username && ticket.created_by_username.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchCategory = categoryFilter === 'all' || ticket.category === categoryFilter;
    
    return matchSearch && matchStatus && matchPriority && matchCategory;
  });

  if (loading) {
    return <p style={{ textAlign: 'center', padding: '50px' }}>Loading tickets...</p>;
  }

  return (
    <div className="admin-tickets-page" style={{ padding: '20px' }}>
      <h1>Admin Dashboard - All Tickets</h1>

      {error && (
        <p style={{
          color: 'red',
          backgroundColor: '#ffebee',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </p>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px',
        marginBottom: '20px',
        padding: '15px',
        backgroundColor: '#f5f5f5',
        borderRadius: '4px'
      }}>
        <input
          type="text"
          placeholder="Search by title or username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
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
            fontSize: '14px'
          }}
        >
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select 
          value={priorityFilter} 
          onChange={(e) => setPriorityFilter(e.target.value)}
          style={{
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          <option value="all">All Priorities</option>
          {PRIORITY_OPTIONS.map(priority => (
            <option key={priority} value={priority}>{priority}</option>
          ))}
        </select>

        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          <option value="all">All Categories</option>
          {CATEGORY_OPTIONS.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <p style={{ marginBottom: '15px', color: '#666', fontSize: '14px' }}>
        Showing {filteredTickets.length} ticket(s) out of {tickets.length} total
      </p>

      {filteredTickets.length === 0 && !error && (
        <p style={{
          textAlign: 'center',
          color: '#666',
          padding: '40px',
          backgroundColor: '#f9f9f9',
          borderRadius: '4px'
        }}>
          No tickets match the current filters.
        </p>
      )}

      {filteredTickets.length > 0 && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderRadius: '4px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#1976d2', color: 'white' }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>User</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Priority</th>
                <th style={thStyle}>Created On</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map((ticket) => (
                <tr 
                  key={ticket.id}
                  style={{
                    borderBottom: '1px solid #ddd',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <td style={tdStyle}>#{ticket.id}</td>
                  <td style={tdStyle}>
                    <strong>{ticket.title}</strong>
                  </td>
                  <td style={tdStyle}>
                    {ticket.created_by_username || 'N/A'}
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: getCategoryColor(ticket.category),
                      color: 'white'
                    }}>
                      {ticket.category}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: getStatusColor(ticket.status),
                      color: 'white'
                    }}>
                      {ticket.status}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      backgroundColor: getPriorityColor(ticket.priority),
                      color: 'white'
                    }}>
                      {ticket.priority || 'N/A'}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString('en-US') : 'N/A'}
                  </td>
                  <td style={tdStyle}>
                    <Link 
                      to={`/tickets/${ticket.id}`}
                      style={{
                        backgroundColor: '#2196F3',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        textDecoration: 'none',
                        fontSize: '13px',
                        display: 'inline-block'
                      }}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  padding: '12px',
  textAlign: 'left',
  fontWeight: 'bold',
  fontSize: '14px'
};

const tdStyle = {
  padding: '12px',
  fontSize: '14px'
};

function getStatusColor(status) {
  switch (status) {
    case 'New':
      return '#2196F3';
    case 'Under Review':
      return '#FF9800';
    case 'Resolved':
      return '#4CAF50';
    default:
      return '#9E9E9E';
  }
}

function getPriorityColor(priority) {
  switch (priority) {
    case 'Critical':
      return '#F44336';
    case 'High':
      return '#FF9800';
    case 'Medium':
      return '#FFC107';
    case 'Low':
      return '#4CAF50';
    default:
      return '#9E9E9E';
  }
}

function getCategoryColor(category) {
  switch (category) {
    case 'Technical':
      return '#9C27B0';
    case 'Financial':
      return '#009688';
    case 'Product':
      return '#FF5722';
    default:
      return '#607D8B';
  }
}
