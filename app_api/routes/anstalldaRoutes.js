// app_api/routes/anstalldaRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/anstalldController');
//const { Layout } = require('../models');
const { Layout, Anstalld } = require('../models');
const mongoose = require('mongoose');


router.get('/mifare/:kod', async (req, res) => {
  try {
    console.log("👉 Mifare route träffad:", req.params.kod);

    const kod = Number(req.params.kod);

    if (isNaN(kod)) {
      return res.status(400).json({ message: 'Invalid Mifare code' });
    }

    const emp = await Anstalld.findOne({
      'Tjanstekort.Mifare_kod': kod
    });

    console.log("👉 Resultat från DB:", emp);

    if (!emp) return res.status(404).json({ message: 'Not found' });

    res.json(emp);

  } catch (err) {
    console.error("❌ Fel:", err);
    res.status(500).json(err);
  }
});

// Layout endpoints (kept same paths but you can split to layoutRoutes later)
router.post('/layouts', async (req, res) => {
  try {
    const layout = new Layout({ name: req.body.name, data: req.body.data });
    const saved = await layout.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/layouts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Ogiltigt id format' });
    const layout = await Layout.findById(id);
    if (!layout) return res.status(404).json({ message: 'Layout ej hittad' });
    res.json(layout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/layouts/by-name/:name', async (req, res) => {
  try {
    const layout = await Layout.findOne({ name: req.params.name });
    if (!layout) return res.status(404).json({ message: 'Layout ej hittad' });
    res.json(layout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/layouts', async (req, res) => {
  try {
    const layouts = await Layout.find();
    res.json(layouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/layouts/:id', async (req, res) => {
  try {
    const layout = await Layout.findById(req.params.id);
    if (!layout) return res.status(404).json({ message: 'Layout ej hittad' });
    layout.name = req.body.name ?? layout.name;
    layout.data = req.body.data ?? layout.data;
    const updated = await layout.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/layouts/:id', async (req, res) => {
  try {
    await Layout.findByIdAndDelete(req.params.id);
    res.json({ message: 'Layout raderad' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Anställda endpoints -> delegate to controller
router.get('/personnummer/:personnummer', async (req, res) => {
  try {
    const { personnummer } = req.params;
    const anstallda = await require('../models').Anstalld.find({ Personnummer: { $regex: personnummer, $options: 'i' } });
    if (anstallda.length === 0) return res.status(404).json({ message: 'Inga anställda hittades med detta personnummer' });
    res.json(anstallda);
  } catch (err) {
    res.status(500).json({ message: 'Serverfel vid hämtning av anställda' });
  }
});



// paginerat, paginerad-sok, sok, paginerat list, CRUD
router.get('/paginerat', controller.getPaginated);
router.get('/paginerad-sok', controller.searchPaginated);
router.get('/sok/:term', controller.searchPaginated); // keep compatibility; query vs param
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
