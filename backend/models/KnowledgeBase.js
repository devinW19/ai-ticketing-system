const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true }, // The actual troubleshooting steps
  tags: [{ type: String }], // e.g., ['VPN', 'Network', 'Cisco']
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // The IT Admin who wrote the article
}, { timestamps: true });

module.exports = mongoose.model('KnowledgeBase', knowledgeBaseSchema);