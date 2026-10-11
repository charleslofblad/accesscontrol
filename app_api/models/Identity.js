// app_api\models\Identity.js

const mongoose = require('mongoose');

const IdentitySchema = new mongoose.Schema({
  identityId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  entraObjectId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Anstalld',
    required: false,
    unique: true,
    sparse: true,
    index: true
  },

  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }],

  displayName: {
    type: String,
    required: true
  },

  identityType: {
    type: String,
    enum: ['Human', 'Agent', 'Service'],
    default: 'Human'
  },

  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Identity', IdentitySchema);