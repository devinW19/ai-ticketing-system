const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const User = require('../models/User'); // We need this to link tickets to users

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