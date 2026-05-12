require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Middleware och routes
const errorHandler = require('./app_api/middleware/errorHandler');
const { exportToXML, xmlToJson } = require('./app_api/services/fileImportExport');
const exportRoutes = require('./app_api/routes/exportRoutes');
const fileConvertRoutes = require('./app_api/routes/fileConvertRoutes');
const anstalldaRoutes = require('./app_api/routes/anstalldaRoutes');

// Init app
const app = express();
const PORT = process.env.PORT || 8000;

// === MongoDB-anslutning ===
require('./app_api/config/db')();

// === Middleware ===
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// === Statisk filserver ===
app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// === Routes ===
app.use('/api/export', exportRoutes);
app.use('/api/files', fileConvertRoutes);
app.use('/api/anstallda', anstalldaRoutes);

// === Multer setup ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'public/images')),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// === Filuppladdningar ===

// 🔹 1. Bilduppladdning
app.post('/upload-image', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Ingen fil mottagen' });
  res.json({ message: 'Bilden laddades upp!', filename: req.file.filename });
});

// 🔹 2. Excel → XML
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet);
    const xml = exportToXML(json);

    const xmlFilePath = path.join(__dirname, 'uploads', 'data.xml');
    fs.writeFileSync(xmlFilePath, xml);

    res.download(xmlFilePath, 'data.xml', err => {
      if (err) console.error(err);
      fs.unlinkSync(filePath);
      fs.unlinkSync(xmlFilePath);
    });
  } catch (err) {
    console.error('❌ Fel vid Excel → XML:', err);
    res.status(500).send('Fel vid filkonvertering.');
  }
});

// 🔹 3. XML → Excel
app.post('/upload-xml', upload.single('file'), (req, res) => {
  try {
    const filePath = req.file.path;
    const xmlData = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, ''); // ta bort BOM
    const jsonObj = xmlToJson(xmlData);

    if (!Array.isArray(jsonObj.persons)) {
      return res.status(400).send('Felaktig XML-struktur.');
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(jsonObj.persons);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Persons');

    const excelFilePath = path.join(__dirname, 'uploads', 'data.xlsx');
    XLSX.writeFile(workbook, excelFilePath);

    res.download(excelFilePath, 'data.xlsx', err => {
      if (err) console.error(err);
      fs.unlinkSync(filePath);
      fs.unlinkSync(excelFilePath);
    });
  } catch (err) {
    console.error('❌ Fel vid XML → Excel:', err);
    res.status(500).send('Fel vid XML-konvertering.');
  }
});



// === Starta servern ===
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Servern körs på http://localhost:${PORT}`);
});
