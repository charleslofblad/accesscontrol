const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  roleId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  name: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ''
  },

  organization: {
    type: String,
    default: ''
  },

  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Role', RoleSchema);