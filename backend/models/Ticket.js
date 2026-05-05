const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  
  // Connects the ticket to the specific user who submitted it
  requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  title: { type: String, required: true },
  description: { type: String, required: true },
  
  status: { 
    type: String, 
    enum: ['Open', 'In_Progress', 'Waiting_On_User', 'Resolved'], 
    default: 'Open' 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    default: 'Medium' 
  },
  
  // This is where your LangGraph AI saves its work
  aiInteractionLog: [{
    aiSuggestedSolution: String,
    userFeedback: String, // e.g., "Did not work", "Resolved my issue"
    timestamp: { type: Date, default: Date.now }
  }],

  // Who in IT is handling this? (Can be null until claimed)
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
  
}, { timestamps: true }); // Automatically adds createdAt and updatedAt dates

module.exports = mongoose.model('Ticket', ticketSchema);