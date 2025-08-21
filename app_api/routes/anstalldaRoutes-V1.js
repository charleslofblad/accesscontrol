const express = require('express');
const router = express.Router();
const Anstalld = require('../models/Anstalld');
const mongoose = require('mongoose');

// Hämta alla anställda
router.get('/', async (req, res) => {
    try {
        const anstallda = await Anstalld.find();
        res.json(anstallda);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Hämta en anställd via ID - Om du inte kan ändra databasen, kan du anpassa API:t så att det söker efter _id som antingen ObjectId eller en sträng.



router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        let anstalld;

        // Om ID är giltigt ObjectId → sök direkt
        if (mongoose.Types.ObjectId.isValid(id)) {
            anstalld = await Anstalld.findById(id);
        }

        // Om vi inte hittade något → prova att söka efter ID som en sträng
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
       //es.status(500).json({ message: "Serverfel vid hämtning av anställd" });
    }
});

// Hämta anställda med delvis matchande personnummer
router.get('/personnummer/:personnummer', async (req, res) => {
    try {
        const { personnummer } = req.params;

        // Sök efter personnummer som innehåller den angivna strängen
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


// Sök anställda baserat på flera fält med delvisa matchningar
router.get('/sok/:term', async (req, res) => {
    try {
        const { term } = req.params;
        console.log(`🔍 Sökterm mottagen: ${term}`);

        // Skapa regex för textfält (case insensitive)
        const regex = new RegExp(term, 'i');

        // Sök endast i STRÄNGFÄLT med regex
        const textQuery = {
            $or: [
                { Efternamn: { $regex: regex } },
                { Fornamn: { $regex: regex } },
                { Personnummer: { $regex: regex } },
                { Roll: { $regex: regex } },
                { Chef: { $regex: regex } }
            ]
        };

        // Sök i NUMERISKA FÄLT genom att omvandla dem till strängar
        const numericQuery = {
            $or: [
                { $expr: { $regexMatch: { input: { $toString: "$Tjanstekort.EM_kod" }, regex: regex } } },
                { $expr: { $regexMatch: { input: { $toString: "$Tjanstekort.Mifare_kod" }, regex: regex } } },
                { $expr: { $regexMatch: { input: { $toString: "$Tjanstekort.RCO" }, regex: regex } } }
            ]
        };

        // Kör sökning i både text- och numeriska fält
        const anstallda = await Anstalld.find({
            $or: [...textQuery.$or, ...numericQuery.$or]
        });

        console.log(`✅ Hittade ${anstallda.length} matchande anställda`);

        if (anstallda.length === 0) {
            return res.status(404).json({ message: 'Inga anställda matchade söktermen' });
        }

        res.json(anstallda);
    } catch (err) {
        console.error("❌ Fel vid sökning av anställda:", err);
        res.status(500).json({ message: 'Serverfel vid sökning av anställda', error: err.message });
    }
});

// Lägg till en ny anställd
router.post('/', async (req, res) => {
    const anstalld = new Anstalld(req.body);
    try {
        const savedAnstalld = await anstalld.save();
        res.status(201).json(savedAnstalld);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Uppdatera en anställd v1
/*
router.put('/:id', async (req, res) => {
    try {
        const updatedAnstalld = await Anstalld.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedAnstalld);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
*/

// Uppdatera en anställd v2
router.put('/:id', async (req, res) => {
    try {
        const anstalld = await Anstalld.findById(req.params.id);
        if (!anstalld) return res.status(404).json({ message: 'Anställd ej hittad' });

        // Uppdatera fält utanför Tjanstekort
        Object.keys(req.body).forEach(key => {
            if (key !== 'Tjanstekort') {
                anstalld[key] = req.body[key];
            }
        });

        // Uppdatera Tjanstekort separat utan konflikt
        if (req.body.Tjanstekort) {
            if (!anstalld.Tjanstekort) anstalld.Tjanstekort = {};
            Object.keys(req.body.Tjanstekort).forEach(key => {
                anstalld.Tjanstekort[key] = req.body.Tjanstekort[key];
            });
        }

        const updatedAnstalld = await anstalld.save();
        res.json(updatedAnstalld);
       // console.error('anstäld med kort uppdatering:', updatedAnstalld);
    } catch (err) {
        console.error('Fel vid uppdatering:', err);
        
        res.status(400).json({ message: err.message });
    }
});



// Radera en anställd
router.delete('/:id', async (req, res) => {
    try {
        await Anstalld.findByIdAndDelete(req.params.id);
        res.json({ message: 'Anställd raderad' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;



