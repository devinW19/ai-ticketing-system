// src/pages/UserPortal.jsx
import { useState } from 'react';
import axios from 'axios';

export default function UserPortal() {
  const [formData, setFormData] = useState({
    requesterEmail: '', title: '', description: '', priority: 'Medium'
  });
  
  const [statusMessage, setStatusMessage] = useState('');
  
  // NEW: State to hold the AI's answer
  const [aiSuggestion, setAiSuggestion] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. Intercept the submission and ask the Mock AI
  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('🤖 AI Agent is analyzing your issue...');

    try {
      const analyzeRes = await axios.post('http://localhost:5000/api/tickets/analyze', { 
        description: formData.description 
      });

      if (analyzeRes.data.hasSuggestion) {
        // The AI found a potential fix! Show it.
        setAiSuggestion(analyzeRes.data.suggestion);
        setStatusMessage('');
      } else {
        // The AI doesn't know. Create the ticket normally.
        submitFinalTicket(null);
      }
    } catch (error) {
      console.error('AI Analysis error:', error);
      submitFinalTicket(null); // Fallback: just submit if AI fails
    }
  };

  // 2. The actual database submission
  const submitFinalTicket = async (aiFeedback) => {
    setStatusMessage('Submitting ticket to IT Support...');
    
    // If the AI tried to help, we save that log to the database!
    const finalData = { ...formData };
    if (aiFeedback) finalData.aiLog = aiFeedback;

    try {
      const response = await axios.post('http://localhost:5000/api/tickets', finalData);
      setStatusMessage(`✅ Ticket created successfully (ID: ${response.data.ticketId})`);
      setFormData({ requesterEmail: '', title: '', description: '', priority: 'Medium' });
      setAiSuggestion(null); // Reset the AI UI
    } catch (error) {
      setStatusMessage('❌ Error submitting ticket.');
    }
  };

  return (
    <div className="page-container">
      <h2>Report an IT Issue</h2>
      
      {/* If the AI has a suggestion, show this special UI box */}
      {aiSuggestion ? (
        <div style={{ backgroundColor: '#e0f2fe', padding: '2rem', borderRadius: '8px', marginTop: '2rem' }}>
          <h3 style={{ color: 'var(--royal-blue)', marginBottom: '1rem' }}>🤖 Let's try to fix this right now!</h3>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}><strong>Suggested Fix:</strong> {aiSuggestion}</p>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => {
              setAiSuggestion(null);
              setFormData({ requesterEmail: '', title: '', description: '', priority: 'Medium' });
              setStatusMessage('✅ Issue resolved without needing a ticket! Great job.');
            }} className="btn-primary" style={{ backgroundColor: '#166534' }}>
              👍 This fixed my issue
            </button>
            
            <button onClick={() => submitFinalTicket("AI fix did not work")} className="btn-primary" style={{ backgroundColor: 'var(--mustard-yellow)' }}>
              👎 I still need help (Submit Ticket)
            </button>
          </div>
        </div>
      ) : (
        /* Otherwise, show the normal form */
        <form className="ticket-form" onSubmit={handleInitialSubmit}>
          <div className="form-group">
            <label>Employee Email</label>
            <input type="email" name="requesterEmail" value={formData.requesterEmail} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Issue Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Detailed Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows="4"></textarea>
          </div>
          <div className="form-group">
            <label>Priority Level</label>
            <select name="priority" value={formData.priority} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>
          <button type="submit" className="btn-primary">Submit Ticket</button>
        </form>
      )}

      {statusMessage && <div className="status-message" style={{ marginTop: '2rem' }}>{statusMessage}</div>}
    </div>
  );
}