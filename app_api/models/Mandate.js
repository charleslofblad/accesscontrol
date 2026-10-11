const mongoose = require('mongoose');

const MandateSchema = new mongoose.Schema({
  mandateId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  identityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Identity',
    required: true,
    index: true
  },

  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
    index: true
  },

  policies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Policy'
  }],

  purpose: {
    type: String,
    required: true
  },

  scope: {
    type: [String],
    default: []
  },

  context: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  validFrom: {
    type: Date,
    default: Date.now
  },

  validUntil: {
    type: Date,
    default: null
  },

  status: {
    type: String,
    enum: ['Active', 'Suspended', 'Revoked', 'Expired'],
    default: 'Active'
  },

  revokedAt: {
    type: Date,
    default: null
  },

  revokedBy: {
    type: String,
    default: null
  },

  revocationReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Mandate', MandateSchema);
