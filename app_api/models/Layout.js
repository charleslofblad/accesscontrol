// models/Layout.js
const mongoose = require('mongoose');

// Lägg LayoutSchema i samma fil eller skapa en ny fil, men registrera separat:
const LayoutSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },  // t.ex. "Standard", "SJ"…
    data: { type: mongoose.Schema.Types.Mixed, default: {} } // ditt canvas‑JSON
  });

module.exports = mongoose.model('Layout', LayoutSchema);
