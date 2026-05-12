const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const xmlbuilder = require('xmlbuilder');
const xml2js = require('xml2js');

// === Multer-konfiguration ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../public/uploads');
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// === Hjälpfunktion: snygg formatering ===
function formatXml(xml) {
  let formatted = '';
  let reg = /(>)(<)(\/*)/g;
  xml = xml.replace(reg, '$1\r\n$2$3');
  let pad = 0;
  xml.split('\r\n').forEach((node) => {
    let indent = 0;
    if (node.match(/.+<\/\w[^>]*>$/)) indent = 0;
    else if (node.match(/^<\/\w/)) if (pad !== 0) pad -= 1;
    else if (node.match(/^<\w[^>]*[^\/]>.*$/)) indent = 1;
    let padding = new Array(pad + 1).join('  ');
    formatted += padding + node + '\r\n';
    pad += indent;
  });
  return formatted;
}

// === Export Excel → XML enligt rätt format ===
function exportToXML(data) {
  let root = xmlbuilder
    .create('arxdata', { version: '1.0', encoding: 'UTF-8' })
    .att('timestamp', new Date().toISOString());

  let persons = root.ele('persons');

  data.forEach(item => {
    const personnummer = item['Personnummer'] || item['personnummer'];
    if (!personnummer) return;

    const person = persons.ele('person');
    person.ele('id', personnummer);

    const extraFields = person.ele('extra_fields');

    const fieldMap = {
      'em-kod': item['EM-kod'] || item['em-kod'] || '',
      'mifare-kod': item['Mifare-kod'] || item['mifare-kod'] || '',
      'alliera-bla': item['Alliera Blå'] || item['alliera-bla'] || '',
      'alliera-gron': item['Alliera Grön'] || item['alliera-gron'] || '',
      'rco': item['RCO'] || item['rco'] || ''
    };

    Object.entries(fieldMap).forEach(([name, value]) => {
      const extraField = extraFields.ele('extra_field');
      extraField.ele('name', name);
      extraField.ele('value', value);
    });
  });

  return formatXml(root.end({ pretty: true }));
}

// === XML → JSON (för import) ===
function xmlToJson(xml) {
  let json = {};
  xml2js.parseString(xml, { explicitArray: false, mergeAttrs: true }, (err, result) => {
    if (err) throw err;
    json = result;
  });
  return json;
}

// === ROUTE: Excel → XML ===
router.post('/excel-to-xml', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Ingen fil mottagen' });

    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const json = XLSX.utils.sheet_to_json(worksheet);

    // 🧠 Här kallar vi vår funktion som skapar rätt XML-struktur
    const xml = exportToXML(json);

    const xmlFilePath = path.join(__dirname, '../../public/uploads', 'export.xml');
    fs.writeFileSync(xmlFilePath, xml, 'utf-8');

    res.download(xmlFilePath, 'export.xml', (err) => {
      fs.unlinkSync(filePath);
      fs.unlinkSync(xmlFilePath);
      if (err) console.error('Fel vid nedladdning:', err);
    });
  } catch (err) {
    console.error('Fel vid Excel→XML:', err);
    res.status(500).json({ error: 'Kunde inte konvertera Excel till XML.' });
  }
});

// === ROUTE: XML → Excel ===
router.post('/xml-to-excel', upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Ingen fil mottagen' });

    const filePath = req.file.path;
    const xmlData = fs.readFileSync(filePath, 'utf-8');
    const jsonData = xmlToJson(xmlData);

    if (!jsonData.arxdata || !jsonData.arxdata.persons) {
      throw new Error('Felaktig XML-struktur.');
    }

    const persons = Array.isArray(jsonData.arxdata.persons.person)
      ? jsonData.arxdata.persons.person
      : [jsonData.arxdata.persons.person];

    const flatData = persons.map(p => {
      const fields = {};
      if (p.extra_fields && p.extra_fields.extra_field) {
        const extras = Array.isArray(p.extra_fields.extra_field)
          ? p.extra_fields.extra_field
          : [p.extra_fields.extra_field];
        extras.forEach(f => {
          fields[f.name] = f.value;
        });
      }
      return { Personnummer: p.id, ...fields };
    });

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(flatData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Persons');

    const excelFilePath = path.join(__dirname, '../../public/uploads', 'export.xlsx');
    XLSX.writeFile(workbook, excelFilePath);

    res.download(excelFilePath, 'export.xlsx', (err) => {
      fs.unlinkSync(filePath);
      fs.unlinkSync(excelFilePath);
      if (err) console.error('Fel vid nedladdning:', err);
    });
  } catch (err) {
    console.error('Fel vid XML→Excel:', err);
    res.status(500).json({ error: 'Kunde inte konvertera XML till Excel.' });
  }
});

module.exports = router;
