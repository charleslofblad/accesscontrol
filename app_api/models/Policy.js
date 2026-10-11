const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
  policyId: {
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

  rules: {
    type: [String],
    default: []
  },

  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }],

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

module.exports = mongoose.model('Policy', PolicySchema);