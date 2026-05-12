// server.js (root)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Middlewares & routes
const errorHandler = require('./app_api/middleware/errorHandler');
const exportRoutes = require('./app_api/routes/exportRoutes'); // behåll din exportRoutes
const anstalldaRoutes = require('./app_api/routes/anstalldaRoutes');
const filesRoutes = require('./app_api/routes/files');

// Init app
const app = express();
const PORT = process.env.PORT || 8000;

// Connect to DB (app_api/config/db.js)
require('./app_api/config/db')();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Static
app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/api/export', exportRoutes);
app.use('/api/files', filesRoutes);
app.use('/api/anstallda', anstalldaRoutes);

// Healthcheck (handy)
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Error handler (must be last)
app.use(errorHandler);

// Start
app.listen(PORT, () => {
  console.log(`🚀 Servern körs på http://localhost:${PORT}`);
});
