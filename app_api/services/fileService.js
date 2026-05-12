// app_api/services/fileService.js
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const { exportToXML, xmlToJson } = require('../services/fileImportExport');

exports.convertExcelToXml = (filePath, outputPath) => {
  const workbook = XLSX.readFile(filePath);
  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const json = XLSX.utils.sheet_to_json(worksheet);
  const xml = exportToXML(json);
  fs.writeFileSync(outputPath, xml, 'utf8');
};

exports.convertXmlToExcel = (filePath, outputPath) => {
  const buffer = fs.readFileSync(filePath);
  let xmlData = buffer.toString('utf8');
  if (xmlData.startsWith('\uFEFF')) xmlData = xmlData.slice(1);
  const jsonObj = xmlToJson(xmlData);
  if (!Array.isArray(jsonObj.persons)) throw Object.assign(new Error('Felaktig JSON-struktur.'), { status: 400 });

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(jsonObj.persons);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Persons');
  XLSX.writeFile(workbook, outputPath);
};
