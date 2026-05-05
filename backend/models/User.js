const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { 
    type: String, 
    enum: ['Marketing', 'Sales', 'Engineering', 'HR', 'Finance', 'IT'],
    required: true 
  },
  role: { 
    type: String, 
    enum: ['Employee', 'IT_Admin'], 
    default: 'Employee' 
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);