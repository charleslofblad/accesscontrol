require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const errorHandler = require('./app_api/middleware/errorHandler');

// Importera export/import-funktionerna
const { exportToXML, xmlToJson } = require('./app_api/services/fileImportExport');

//word export
const exportRoutes = require('./app_api/routes/exportRoutes');


const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

//ny
require('./app_api/config/db')();


// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// word export
app.use('/api/export', exportRoutes);

// Statisk åtkomst för bilder
app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Multer för filuppladdning
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/images'));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

// === ROUTES ===

// Bilduppladdning
app.post('/upload-image', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Ingen fil mottagen' });
  }

  res.json({
    message: 'Bilden laddades upp på riktigt!',
    filename: req.file.filename
  });
});

// Excel → XML
app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = req.file.path;
  const workbook = XLSX.readFile(filePath);
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const json = XLSX.utils.sheet_to_json(worksheet);
  const xml = exportToXML(json);

  const xmlFilePath = path.join(__dirname, 'uploads', 'data.xml');
  fs.writeFileSync(xmlFilePath, xml);

  res.download(xmlFilePath, 'data.xml', (err) => {
    if (err) console.error(err);
    fs.unlinkSync(filePath);
    fs.unlinkSync(xmlFilePath);
  });
});

// XML → Excel
app.post('/upload-xml', upload.single('file'), (req, res) => {
  const filePath = req.file.path;
  fs.readFile(filePath, (err, buffer) => {
    if (err) {
      return res.status(500).send('Error reading XML file.');
    }

    let xmlData = buffer.toString('utf-8');
    if (xmlData.startsWith('\uFEFF')) {
      xmlData = xmlData.slice(1); // ta bort BOM
    }

    const jsonObj = xmlToJson(xmlData);

    if (!Array.isArray(jsonObj.persons)) {
      return res.status(500).send('Invalid JSON structure.');
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(jsonObj.persons);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Persons');

    const excelFilePath = path.join(__dirname, 'uploads', 'data.xlsx');
    XLSX.writeFile(workbook, excelFilePath);

    res.download(excelFilePath, 'data.xlsx', (err) => {
      if (err) console.error(err);
      fs.unlinkSync(filePath);
      fs.unlinkSync(excelFilePath);
    });
  });
});

// MongoDB-anslutning
/*
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ use the forse - MongoDB ansluten: ' + MONGO_URI))
  .catch(err => console.error('❌ MongoDB anslutningsfel:', err));

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});
*/

// Anställda-router
const anstalldaRoutes = require('./app_api/routes/anstalldaRoutes');
app.use('/api/anstallda', anstalldaRoutes);

// Starta servern
app.listen(PORT, () => {
  console.log(`🚀 Servern körs på http://localhost:${PORT}`);
});
