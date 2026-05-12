// app_api/controllers/fileController.js
const path = require('path');
const fs = require('fs');
const fileService = require('../services/fileService');

exports.excelToXml = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Ingen fil mottagen' });

    const filePath = req.file.path;
    const xmlFilePath = path.join(__dirname, '../../public/uploads', `data-${Date.now()}.xml`);
    fileService.convertExcelToXml(filePath, xmlFilePath);

    res.download(xmlFilePath, 'data.xml', (err) => {
      // cleanup
      try { fs.unlinkSync(filePath); } catch (e) {}
      try { fs.unlinkSync(xmlFilePath); } catch (e) {}
      if (err) return next(err);
    });
  } catch (err) {
    next(err);
  }
};

exports.xmlToExcel = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Ingen fil mottagen' });

    const filePath = req.file.path;
    const excelFilePath = path.join(__dirname, '../../public/uploads', `data-${Date.now()}.xlsx`);
    fileService.convertXmlToExcel(filePath, excelFilePath);

    res.download(excelFilePath, 'data.xlsx', (err) => {
      // cleanup
      try { fs.unlinkSync(filePath); } catch (e) {}
      try { fs.unlinkSync(excelFilePath); } catch (e) {}
      if (err) return next(err);
    });
  } catch (err) {
    next(err);
  }
};
