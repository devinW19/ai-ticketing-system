const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const User = require('../models/User'); // We need this to link tickets to users

// @route   POST /api/tickets/analyze
// @desc    Mock AI: Scans ticket description for keywords and returns a solution
router.post('/analyze', (req, res) => {
  const { description } = req.body;
  const lowerDesc = description.toLowerCase();

  // Our Mock "Knowledge Base"
  const mockKnowledgeBase = [
    {
      keywords: ['vpn', 'cisco', 'anyconnect', 'connection'],
      solution: "It looks like you are experiencing a VPN issue. Have you tried opening Cisco AnyConnect, clicking the gear icon, and selecting 'Clear Token'? Please try this and restart your connection."
    },
    {
      keywords: ['password', 'login', 'lock', 'locked'],
      solution: "Password issues are common! You can securely reset your password right now by visiting myaccount.company.com and using your secondary email or SMS authentication."
    },
    {
      keywords: ['printer', 'print', 'paper', 'jam'],
      solution: "Printer issues? Please ensure you are connected to the office network. If the printer says 'Offline', try removing it from 'Devices and Printers' and re-adding it via the network path: \\\\printserver\\office-printer."
    }
  ];

  // Search the array to see if any keywords match the user's description
  const match = mockKnowledgeBase.find(article => 
    article.keywords.some(keyword => lowerDesc.includes(keyword))
  );

  if (match) {
    // We found a fix! Send it back.
    res.json({ hasSuggestion: true, suggestion: match.solution });
  } else {
    // AI has no idea how to fix this.
    res.json({ hasSuggestion: false });
  }
});

// @route   POST /api/tickets
// @desc    Create a new support ticket
router.post('/', async (req, res) => {
  try {
    const { requesterEmail, title, description, priority } = req.body;

    // 1. Find the user by email (in a real app, this comes from their login token)
    let user = await User.findOne({ email: requesterEmail });
    
    // Fallback for testing: Auto-create a dummy user if they don't exist yet
    if (!user) {
      user = await User.create({
        name: 'Test Employee',
        email: requesterEmail,
        department: 'IT',
      });
    }

    // 2. Generate a unique Ticket ID (e.g., INC-1684329)
    const ticketId = `INC-${Math.floor(100000 + Math.random() * 900000)}`;

    // 3. Create and save the ticket
    const newTicket = new Ticket({
      ticketId,
      requester: user._id,
      title,
      description,
      priority: priority || 'Medium'
    });

    const savedTicket = await newTicket.save();
    res.status(201).json(savedTicket);

  } catch (error) {
    console.error('Error creating ticket:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/tickets
// @desc    Get all tickets (for the IT Dashboard)
router.get('/', async (req, res) => {
  try {
    // .populate() replaces the user ID with the actual user's name and department!
    const tickets = await Ticket.find().populate('requester', 'name department email');
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;