// src/pages/UserPortal.jsx
import { useState } from 'react';
import axios from 'axios';

export default function UserPortal() {
  const [formData, setFormData] = useState({
    requesterEmail: '',
    title: '',
    description: '',
    priority: 'Medium'
  });
  
  const [statusMessage, setStatusMessage] = useState('');

  // Update state when user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Send data to backend when form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('Submitting ticket...');

    try {
      // POST request to your Express API
      const response = await axios.post('http://localhost:5000/api/tickets', formData);
      
      setStatusMessage(`✅ Success! Your ticket has been created (ID: ${response.data.ticketId})`);
      
      // Clear the form
      setFormData({ requesterEmail: '', title: '', description: '', priority: 'Medium' });
    } catch (error) {
      console.error('Submission error:', error);
      setStatusMessage('❌ Error submitting ticket. Please ensure the backend server is running.');
    }
  };

  return (
    <div className="page-container">
      <h2>Report an IT Issue</h2>
      <p>Submit a ticket and our automated support system will assist you.</p>

      <form className="ticket-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Employee Email</label>
          <input 
            type="email" 
            name="requesterEmail" 
            value={formData.requesterEmail} 
            onChange={handleChange} 
            required 
            placeholder="you@company.com"
          />
        </div>

        <div className="form-group">
          <label>Issue Title</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
            placeholder="Brief summary of the issue"
          />
        </div>

        <div className="form-group">
          <label>Detailed Description</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
            rows="4"
            placeholder="Please provide any error messages or specific details..."
          ></textarea>
        </div>

        <div className="form-group">
          <label>Priority Level</label>
          <select name="priority" value={formData.priority} onChange={handleChange}>
            <option value="Low">Low - Not urgent</option>
            <option value="Medium">Medium - Affects my work</option>
            <option value="High">High - Cannot work</option>
            <option value="Critical">Critical - Company-wide outage</option>
          </select>
        </div>

        <button type="submit" className="btn-primary">Submit Ticket</button>

        {statusMessage && <div className="status-message">{statusMessage}</div>}
      </form>
    </div>
  );
}