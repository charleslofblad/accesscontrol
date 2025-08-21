require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const XLSX = require('xlsx');
const xmlbuilder = require('xmlbuilder');
const xml2js = require('xml2js');
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

//require('./app_api/models/db');

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;


//const PORT = process.env.PORT || 8000;
//const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/anstallda_db';

// Middleware
app.use(cors());
//app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '10mb' }));       // tillåter upp till 10 MB
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // också för urlencoded

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(express.static('public'));
// för att exponera bilder så de kan laddas i webbläsaren
app.use('/images', express.static(path.join(__dirname, 'public/images')));


// Konfigurera multer för filuppladdning
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
     // cb(null, 'app_public/public/images');
      cb(null, path.join(__dirname, 'public/images')); // rätt mapp
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Behåll filnamnet som det är
    }
  });
  

const upload = multer({ storage: storage });

// START

//app.use('/images', express.static(path.join(__dirname, 'app_public/public/images')));

// Route för att hantera bilduppladdning
app.post('/upload-image', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Ingen fil mottagen' });
  }

  // Skicka tillbaka filnamnet så frontend kan skapa korrekt URL
  res.json({ 
    message: 'Bilden laddades upp på rigtigt nu!.',
    filename: req.file.filename
  });
});
// END



// MongoDB connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ use the forse - MongoDB ansluten' + MONGO_URI))
  .catch(err => console.error('❌ MongoDB anslutningsfel:', err));

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
  });





// Importera router
const anstalldaRoutes = require('./app_api/routes/anstalldaRoutes');
app.use('/api/anstallda', anstalldaRoutes);

/*
// Route för att hantera bilduppladdning
app.post('/upload-image', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send('File uploaded successfully på riktigt !.');
});
*/

// Route för att hantera uppladdning av Excel-filer och konvertera dem till XML
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
    if (err) {
      console.error(err);
    }
    fs.unlinkSync(filePath);
    fs.unlinkSync(xmlFilePath);
  });
});

// Route för att hantera uppladdning av XML-filer och konvertera dem till Excel
app.post('/upload-xml', upload.single('file'), (req, res) => {
  const filePath = req.file.path;
  fs.readFile(filePath, (err, buffer) => {
    if (err) {
      return res.status(500).send('Error reading XML file.');
    }

    // Konvertera bufferten till en sträng utan BOM
    let xmlData = buffer.toString('utf-8');

    // Ta bort BOM om det finns
    if (xmlData.startsWith('\uFEFF')) {
      xmlData = xmlData.slice(1);
    }

    // Logga XML-data för att kontrollera innehållet
    console.log(xmlData);

    const jsonObj = xmlToJson(xmlData);

    // Kontrollera att jsonObj.persons är en array
    if (!Array.isArray(jsonObj.persons)) {
      return res.status(500).send('Invalid JSON structure.');
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(jsonObj.persons);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Persons');

    const excelFilePath = path.join(__dirname, 'uploads', 'data.xlsx');
    XLSX.writeFile(workbook, excelFilePath);

    res.download(excelFilePath, 'data.xlsx', (err) => {
      if (err) {
        console.error(err);
      }
      fs.unlinkSync(filePath);
      fs.unlinkSync(excelFilePath);
    });
  });
});



function exportToXML(data) {
    let root = xmlbuilder.create('arxdata', { version: '1.0', encoding: 'UTF-8' })
        .att('timestamp', new Date().toISOString());
    let persons = root.ele('persons');
    let cards = root.ele('cards');
    data.forEach(item => {
        let person = persons.ele('person');
        person.ele('id', item['Personnummer']);
        person.ele('first_name', item['FormatFornamn']);
        person.ele('last_name', item['FormatEfternamn']);
        person.ele('pin_code', item['PIN-kod']);

        let accessCategories = person.ele('access_categories');
        if (item['Behörighetskategori_1']) {
            let accessCategory1 = accessCategories.ele('access_category');
            accessCategory1.ele('name', item['Behörighetskategori_1']);
        }
        if (item['Behörighetskategori_2']) {
            let accessCategory2 = accessCategories.ele('access_category');
            accessCategory2.ele('name', item['Behörighetskategori_2']);
        }

        let card = cards.ele('card');
        card.ele('number', item['Mifare-kod']);
        card.ele('format_name', 'Mifare CSN');
        card.ele('person_id', item['Personnummer']);
        card.ele('description', 'Tjänstekort');
    });
    return formatXml(root.end({ pretty: true }));
}

function formatXml(xml) {
  let formatted = '';
  let reg = /(>)(<)(\/*)/g;
  xml = xml.replace(reg, '$1\r\n$2$3');
  let pad = 0;
  xml.split('\r\n').forEach((node) => {
    let indent = 0;
    if (node.match(/.+<\/\w[^>]*>$/)) {
      indent = 0;
    } else if (node.match(/^<\/\w/)) {
      if (pad !== 0) {
        pad -= 1;
      }
    } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
      indent = 1;
    } else {
      indent = 0;
    }
    let padding = new Array(pad + 1).join('  ');
    formatted += padding + node + '\r\n';
    pad += indent;
  });
  return formatted;
}

function xmlToJson(xml) {
  let json = {};
  xml2js.parseString(xml, { explicitArray: false, mergeAttrs: true }, (err, result) => {
    if (err) {
      throw err;
    }

    // Extrahera persons-data
    const persons = Array.isArray(result.arxdata.persons.person)
      ? result.arxdata.persons.person.map(person => ({
          Personnummer: person.id.replace('ID:', '').split('_')[1], // Extrahera ID
          Fornamn: person.first_name,
          Efternamn: person.last_name.split(', ')[1], // Ta bort företagsnamn
          Beskrivning: person.description,
          PINkod: person.pin_code,
          TillatLoggning: person.allow_logging,
          ArxGoAccess: person.arx_go_access,
          TwoStepVerificationType: person.two_step_verification_type,
          SpecialAccess: person.special_access,
          Behorighetskategori_1: person.access_categories.access_category
            ? person.access_categories.access_category.name
            : null
        }))
      : [];

    // Extrahera cards-data
    const cards = Array.isArray(result.arxdata.cards.card)
      ? result.arxdata.cards.card.map(card => ({
          Mifarekod: card.number,
          FormatNamn: card.format_name,
          Personnummer: card.person_id,
          Beskrivning: card.description
        }))
      : [];

    json = { persons, cards };
  });
  return json;
}

//require('./app_api/ARX/arx-import-export.js');

// Starta servern
app.listen(PORT, () => {
  console.log(`🚀 Servern körs på http://localhost:${PORT}`);
});
