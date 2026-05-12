// app_api/config/db.js
const mongoose = require('mongoose');

module.exports = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/anstallda_db';
  try {
    await mongoose.connect(uri, {
      // optional recommended options (Mongoose 8 sköter många automatiskt)
      dbName: undefined,
    });
    console.log('✅ MongoDB ansluten:', uri);
  } catch (err) {
    console.error('❌ Misslyckades ansluta MongoDB:', err.message);
    process.exit(1);
  }

  // Graceful shutdown helpers (async/await - inga callbacks)
  const graceful = async (msg, exitCode = 0) => {
    try {
      await mongoose.connection.close();
      console.log(`⚠️ Mongoose frånkopplad genom ${msg}`);
      if (exitCode !== null) process.exit(exitCode);
    } catch (err) {
      console.error('❌ Fel vid mongoose.close():', err);
      process.exit(1);
    }
  };

  process.once('SIGUSR2', async () => {
    await graceful('nodemon restart', null);
    process.kill(process.pid, 'SIGUSR2');
  });

  process.on('SIGINT', async () => {
    await graceful('app termination (SIGINT)', 0);
  });

  process.on('SIGTERM', async () => {
    await graceful('Heroku app termination (SIGTERM)', 0);
  });
};
