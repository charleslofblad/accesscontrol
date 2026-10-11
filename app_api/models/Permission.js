
const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  permissionId: {
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

  action: {
    type: String,
    required: true
  },

  resource: {
    type: String,
    required: true
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

module.exports = mongoose.model('Permission', PermissionSchema);