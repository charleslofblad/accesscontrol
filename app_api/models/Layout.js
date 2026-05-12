// app_api/models/Layout.js
const mongoose = require('mongoose');

const LayoutSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  data: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('Layout', LayoutSchema);
