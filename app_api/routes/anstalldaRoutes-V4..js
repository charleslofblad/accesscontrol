const express = require('express');
const router = express.Router();
const { Anstalld, Layout } = require('../models');
const mongoose = require('mongoose');

// --- LAYOUT-ENDPOINTS ---

// POST: Skapa ny layout
router.post('/layouts', async (req, res) => {
  try {
    const layout = new Layout({ name: req.body.name, data: req.body.data });
    const saved = await layout.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET: Hämta enskild layout via ID
router.get('/layouts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Ogiltigt id‑format' });
    }
    const layout = await Layout.findById(id);
    if (!layout) {
      return res.status(404).json({ message: 'Layout ej hittad' });
    }
    res.json(layout);
  } catch (err) {
    console.error('Fel vid hämtning av layout:', err);
    res.status(500).json({ message: err.message });
  }
});

// GET: Hämta layout via namn
router.get('/layouts/by-name/:name', async (req, res) => {
  try {
    const layout = await Layout.findOne({ name: req.params.name });
    if (!layout) return res.status(404).json({ message: 'Layout ej hittad' });
    res.json(layout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Hämta alla layouter
router.get('/layouts', async (req, res) => {
  try {
    const layouts = await Layout.find();
    res.json(layouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT: Uppdatera layout
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

// DELETE: Radera layout
router.delete('/layouts/:id', async (req, res) => {
  try {
    await Layout.findByIdAndDelete(req.params.id);
    res.json({ message: 'Layout raderad' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- ANSTÄLLDA-ENDPOINTS ---

// GET: Hämta alla anställda
router.get('/', async (req, res) => {
  try {
    const anstallda = await Anstalld.find();
    res.json(anstallda);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: Hämta en anställd via ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let anstalld;

    if (mongoose.Types.ObjectId.isValid(id)) {
      anstalld = await Anstalld.findById(id);
    }
    if (!anstalld) {
      anstalld = await Anstalld.findOne({ _id: id });
    }
    if (!anstalld) {
      return res.status(404).json({ message: 'Oj ? Anställd ej hittad' });
    }

    res.json(anstalld);
  } catch (err) {
    console.error("Fel vid hämtning av anställd:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET: Hämta anställda via del av personnummer
router.get('/personnummer/:personnummer', async (req, res) => {
  try {
    const { personnummer } = req.params;
    const anstallda = await Anstalld.find({ Personnummer: { $regex: personnummer, $options: 'i' } });

    if (anstallda.length === 0) {
      return res.status(404).json({ message: 'Inga anställda hittades med detta personnummer' });
    }

    res.json(anstallda);
  } catch (err) {
    console.error("Fel vid hämtning av anställd via personnummer:", err);
    res.status(500).json({ message: 'Serverfel vid hämtning av anställda' });
  }
});

// GET: Paginerad lista
router.get('/paginerat', async (req, res) => {
  const skip = parseInt(req.query.skip) || 0;
  const limit = parseInt(req.query.limit) || 100;

  try {
    const [anstallda, total] = await Promise.all([
      Anstalld.find().skip(skip).limit(limit),
      Anstalld.countDocuments()
    ]);
    res.json({ anstallda, total });
  } catch (err) {
    console.error("Fel vid paginerad hämtning:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET: Paginerad sökning
router.get('/paginerad-sok', async (req, res) => {
  try {
    const term = req.query.search || '';
    const limit = parseInt(req.query.limit) || 100;
    const skip = parseInt(req.query.skip) || 0;
    const regex = new RegExp(term, 'i');

    const textQuery = {
      $or: [
        { Efternamn: { $regex: regex } },
        { Fornamn: { $regex: regex } },
        { Personnummer: { $regex: regex } },
        { Roll: { $regex: regex } },
        { Chef: { $regex: regex } }
      ]
    };

    const numericQuery = {
      $or: [
        { $expr: { $regexMatch: { input: { $toString: "$Tjanstekort.EM_kod" }, regex: regex } } },
        { $expr: { $regexMatch: { input: { $toString: "$Tjanstekort.Mifare_kod" }, regex: regex } } },
        { $expr: { $regexMatch: { input: { $toString: "$Tjanstekort.RCO" }, regex: regex } } }
      ]
    };

    const combinedQuery = { $or: [...textQuery.$or, ...numericQuery.$or] };

    const [anstallda, totaltAntal] = await Promise.all([
      Anstalld.find(combinedQuery).skip(skip).limit(limit),
      Anstalld.countDocuments(combinedQuery)
    ]);

    res.json({ anstallda, total: totaltAntal });
  } catch (err) {
    console.error("Fel vid paginerad sökning:", err);
    res.status(500).json({ message: 'Serverfel vid paginerad sökning av anställda', error: err.message });
  }
});

// GET: Sök anställda via fält
router.get('/sok/:term', async (req, res) => {
  try {
    const { term } = req.params;
    const regex = new RegExp(term, 'i');

    const textQuery = {
      $or: [
        { Efternamn: { $regex: regex } },
        { Fornamn: { $regex: regex } },
        { Personnummer: { $regex: regex } },
        { Roll: { $regex: regex } },
        { Chef: { $regex: regex } }
      ]
    };

    const numericQuery = {
      $or: [
        { $expr: { $regexMatch: { input: { $toString: "$Tjanstekort.EM_kod" }, regex: regex } } },
        { $expr: { $regexMatch: { input: { $toString: "$Tjanstekort.Mifare_kod" }, regex: regex } } },
        { $expr: { $regexMatch: { input: { $toString: "$Tjanstekort.RCO" }, regex: regex } } }
      ]
    };

    const anstallda = await Anstalld.find({ $or: [...textQuery.$or, ...numericQuery.$or] });

    if (anstallda.length === 0) {
      return res.status(404).json({ message: 'Inga anställda matchade söktermen' });
    }

    res.json(anstallda);
  } catch (err) {
    console.error("Fel vid sökning av anställda:", err);
    res.status(500).json({ message: 'Serverfel vid sökning av anställda', error: err.message });
  }
});

// POST: Lägg till anställd
router.post('/', async (req, res) => {
  const anstalld = new Anstalld(req.body);
  try {
    const savedAnstalld = await anstalld.save();
    res.status(201).json(savedAnstalld);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT: Uppdatera anställd
router.put('/:id', async (req, res) => {
  try {
    const anstalld = await Anstalld.findById(req.params.id);
    if (!anstalld) return res.status(404).json({ message: 'Anställd ej hittad' });

    Object.keys(req.body).forEach(key => {
      if (key !== 'Tjanstekort') {
        anstalld[key] = req.body[key];
      }
    });

    if (req.body.Tjanstekort) {
      if (!anstalld.Tjanstekort) anstalld.Tjanstekort = {};
      Object.keys(req.body.Tjanstekort).forEach(key => {
        anstalld.Tjanstekort[key] = req.body.Tjanstekort[key];
      });
    }

    const updatedAnstalld = await anstalld.save();
    res.json(updatedAnstalld);
  } catch (err) {
    console.error('Fel vid uppdatering:', err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Radera anställd
router.delete('/:id', async (req, res) => {
  try {
    await Anstalld.findByIdAndDelete(req.params.id);
    res.json({ message: 'Anställd raderad' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
