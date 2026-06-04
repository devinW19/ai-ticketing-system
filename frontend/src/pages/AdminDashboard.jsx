// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tickets when the component loads
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      // GET request to your Express API
      const response = await axios.get('http://localhost:5000/api/tickets');
      setTickets(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setLoading(false);
    }
  };

  // Helper function to color-code priorities
  const getPriorityClass = (priority) => {
    const p = priority?.toLowerCase();
    if (p === 'high' || p === 'critical') return 'badge badge-high';
    if (p === 'medium') return 'badge badge-medium';
    return 'badge badge-low';
  };

  return (
    <div className="page-container">
      <h2>IT Support Dashboard</h2>
      <p>Manage and resolve incoming employee requests.</p>

      {loading ? (
        <p>Loading tickets...</p>
      ) : (
        <div className="table-container">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Requester</th>
                <th>Issue Summary</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center' }}>No active tickets.</td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket._id}>
                    <td><strong>{ticket.ticketId}</strong></td>
                    <td>{ticket.requester?.name || 'Unknown Employee'}</td>
                    <td>{ticket.title}</td>
                    <td>
                      <span className={getPriorityClass(ticket.priority)}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-open">{ticket.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}