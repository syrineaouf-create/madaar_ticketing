import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function TicketDetailPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('is_admin') === 'true';

  useEffect(() => {
    async function fetchTicket() {
      setError('');
      const token = localStorage.getItem('access');
      if (!token) {
        setError('You must be logged in to view this ticket.');
        return;
      }

      try {
        const response = await fetch(`http://127.0.0.1:8000/api/tickets/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          setError('Error loading ticket.');
          return;
        }

        const data = await response.json();
        setTicket(data);
        setNewStatus(data.status);
      } catch (err) {
        console.error(err);
        setError('Network error.');
      }
    }

    fetchTicket();
  }, [id]);

  async function handleStatusUpdate() {
    if (newStatus === ticket.status) {
      alert('Status is already set to this value.');
      return;
    }

    setUpdating(true);
    setUpdateSuccess('');
    setError('');

    const token = localStorage.getItem('access');
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/tickets/${id}/status/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        setError('Error updating status.');
        setUpdating(false);
        return;
      }

      setTicket({ ...ticket, status: newStatus });
      setUpdateSuccess('Status updated successfully!');
      setUpdating(false);
    } catch (err) {
      console.error(err);
      setError('Network error.');
      setUpdating(false);
    }
  }

  if (error && !ticket) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p style={{ color: 'red', fontSize: '16px' }}>{error}</p>
        <button 
          onClick={() => navigate(-1)}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!ticket) {
    return (
      <p style={{ textAlign: 'center', padding: '50px', fontSize: '16px' }}>
        Loading ticket...
      </p>
    );
  }

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px' 
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          borderBottom: '2px solid #1976d2', 
          paddingBottom: '15px',
          marginBottom: '20px'
        }}>
          <h1 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>
            Ticket #{ticket.id}
          </h1>
          <div style={{ fontSize: '14px', color: '#666' }}>
            Created on {ticket.created_at ? new Date(ticket.created_at).toLocaleString('en-US') : 'N/A'}
          </div>
        </div>

        {updateSuccess && (
          <p style={{
            color: '#4CAF50',
            backgroundColor: '#e8f5e9',
            padding: '10px',
            borderRadius: '4px',
            marginBottom: '20px',
            fontWeight: 'bold'
          }}>
            ✓ {updateSuccess}
          </p>
        )}

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

        <div style={{ marginBottom: '20px' }}>
          <div style={detailRowStyle}>
            <strong style={labelStyle}>Title:</strong>
            <span style={valueStyle}>{ticket.title}</span>
          </div>

          <div style={detailRowStyle}>
            <strong style={labelStyle}>Description:</strong>
            <p style={{ ...valueStyle, whiteSpace: 'pre-wrap' }}>
              {ticket.description}
            </p>
          </div>

          <div style={detailRowStyle}>
            <strong style={labelStyle}>Status:</strong>
            <span style={{
              ...valueStyle,
              padding: '5px 15px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: getStatusColor(ticket.status),
              color: 'white',
              display: 'inline-block'
            }}>
              {ticket.status}
            </span>
          </div>

          <div style={detailRowStyle}>
            <strong style={labelStyle}>Category:</strong>
            <span style={{
              ...valueStyle,
              padding: '4px 10px',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: getCategoryColor(ticket.category),
              color: 'white',
              display: 'inline-block'
            }}>
              {ticket.category}
            </span>
          </div>

          {ticket.priority && (
            <div style={detailRowStyle}>
              <strong style={labelStyle}>Priority:</strong>
              <span style={{
                ...valueStyle,
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 'bold',
                backgroundColor: getPriorityColor(ticket.priority),
                color: 'white',
                display: 'inline-block'
              }}>
                {ticket.priority}
              </span>
            </div>
          )}

          {ticket.created_by_username && (
            <div style={detailRowStyle}>
              <strong style={labelStyle}>Created by:</strong>
              <span style={valueStyle}>{ticket.created_by_username}</span>
            </div>
          )}

          {ticket.attachment && (
            <div style={detailRowStyle}>
              <strong style={labelStyle}>Attachment:</strong>
              <div style={valueStyle}>
                {ticket.attachment.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                  <div>
                    <img 
                      src={ticket.attachment} 
                      alt="Ticket attachment" 
                      style={{
                        maxWidth: '100%',
                        maxHeight: '400px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        marginTop: '10px'
                      }} 
                    />
                    <br />
                    <a 
                      href={ticket.attachment} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        color: '#2196F3',
                        textDecoration: 'none',
                        fontSize: '14px',
                        marginTop: '5px',
                        display: 'inline-block'
                      }}
                    >
                      View full image
                    </a>
                  </div>
                ) : ticket.attachment.match(/\.pdf$/i) ? (
                  <a 
                    href={ticket.attachment} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      color: '#2196F3',
                      textDecoration: 'none',
                      fontSize: '14px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    📄 View PDF document
                  </a>
                ) : (
                  <a 
                    href={ticket.attachment} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      color: '#2196F3',
                      textDecoration: 'none',
                      fontSize: '14px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    📎 Download attachment
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {isAdmin && (
          <div style={{
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px',
            marginTop: '30px',
            border: '1px solid #ddd'
          }}>
            <h3 style={{ marginTop: 0, color: '#333' }}>Update Status (Admin)</h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <select 
                value={newStatus} 
                onChange={(e) => setNewStatus(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Resolved">Resolved</option>
              </select>
              <button 
                onClick={handleStatusUpdate}
                disabled={updating || newStatus === ticket.status}
                style={{
                  backgroundColor: updating || newStatus === ticket.status ? '#ccc' : '#4CAF50',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: updating || newStatus === ticket.status ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        )}

        <div style={{ marginTop: '30px' }}>
          <button 
            onClick={() => navigate(-1)}
            style={{
              backgroundColor: '#2196F3',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}

const detailRowStyle = {
  marginBottom: '20px',
  paddingBottom: '15px',
  borderBottom: '1px solid #eee'
};

const labelStyle = {
  fontSize: '14px',
  color: '#666',
  display: 'block',
  marginBottom: '8px'
};

const valueStyle = {
  fontSize: '16px',
  color: '#333'
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
