const express = require("express");
const fs = require("fs");
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const { inspect } = require("util");
const router = express.Router();
const Anstalld = require("../models/Anstalld");
const { execSync } = require("child_process");
const os = require("os");

// Hjälpfunktion – rensa kontrolltecken
function cleanTemplateString(str) {
  return str
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .replace(/\{\{\s+/g, "{{")
    .replace(/\s+\}\}/g, "}}");
}

// 🧩 Hjälpfunktion – försök reparera splittrade {{taggar}}
function repairBrokenTags(docxPath) {
  const PizZip = require("pizzip");
  const content = fs.readFileSync(docxPath);
  const zip = new PizZip(content);

  // Läs XML från Word-filen
  const xmlPath = "word/document.xml";
  const xmlContent = zip.file(xmlPath).asText();

  // Reparera splittrade {{ }} som delas upp av Word
  let repairedXml = xmlContent
    .replace(/(\{\{)\s*<\/w:t>\s*<w:t[^>]*>/g, "{{")
    .replace(/<\/w:t>\s*<w:t[^>]*>\s*(\}\})/g, "}}");

  // Ersätt innehållet i zip-filen
  zip.file(xmlPath, repairedXml);

  // Spara som ny fil
  const fixedPath = docxPath.replace(".docx", "_fixed.docx");
  fs.writeFileSync(fixedPath, zip.generate({ type: "nodebuffer" }));
  console.log("🔧 Mall reparerad och sparad som:", fixedPath);

  return fixedPath;
}

router.get("/person/:id", async (req, res) => {
  try {
    console.log("===========================================");
    console.log("📤 Exportförfrågan mottagen");
    console.log("🆔 ID:", req.params.id);

    // 1️⃣ Hämta person
    const person = await Anstalld.findById(req.params.id).lean();
    if (!person) return res.status(404).json({ message: "Person ej hittad" });

    console.log("📄 Hittad person:", person);

    // 2️⃣ Bearbeta data
    const pnr = person.Personnummer || "";
    const kortPnr = pnr.substring(2, 8);
    const sistaFyra = pnr.slice(-4);
    const fulltNamn = `${person.Fornamn} ${person.Efternamn}`;
    const emKod = person.Tjanstekort?.EM_kod || "";

    console.log("🧮 Bearbetat:", { kortPnr, sistaFyra, fulltNamn, emKod });

    // 3️⃣ Ladda mallen
    let mallPath = path.join(__dirname, "../../mallar/mall-01.docx");

    if (!fs.existsSync(mallPath)) {
      console.error("❌ Mallfil hittades inte:", mallPath);
      return res.status(500).json({ error: "Mallfil saknas" });
    }

    console.log("📁 Mallfil hittad:", mallPath);

    // 4️⃣ Läs DOCX-filen som Buffer
    let content = fs.readFileSync(mallPath);
    let zip = new PizZip(content);

    let doc;
    try {
      doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
    } catch (err) {
      console.error("⚠️ Fel vid initiering av Docxtemplater:", err);

      // 🧩 Försök reparera om vi hittar trasiga taggar
      if (err.properties && err.properties.errors && err.properties.errors.length > 0) {
        console.log("⚙️ Försöker reparera mallen automatiskt...");
        mallPath = repairBrokenTags(mallPath);
        content = fs.readFileSync(mallPath);
        zip = new PizZip(content);
        try {
          doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
          console.log("✅ Mallen reparerades framgångsrikt!");
        } catch (innerErr) {
          console.error("❌ Misslyckades även efter reparation:", innerErr);
          return res.status(500).json({ error: "Kunde inte reparera mallen" });
        }
      } else {
        return res.status(500).json({ error: "Mallen kunde inte laddas korrekt" });
      }
    }

    // 5️⃣ Förbered data till mallen
    const dataTillMallen = {
      Fullt_namn: fulltNamn,
      KortPersonummer: kortPnr,
      EMkod: emKod,
      SistaFyra: sistaFyra,
      Datum: new Date().toLocaleDateString("sv-SE"),
    };

    console.log("🧾 Data till mall:", dataTillMallen);

    // 6️⃣ Rendera dokumentet
    try {
      doc.render(dataTillMallen);
    } catch (error) {
      console.error("❌ Docxtemplater-fel:", inspect(error, false, null, true));
      if (error.properties && error.properties.errors) {
        error.properties.errors.forEach((e) => {
          console.error("➡️ Detaljerat tag-fel:", e);
        });
      }
      return res.status(500).json({
        error: "Fel vid rendering av Word-mall",
        details: error.properties?.errors || error.message,
      });
    }

    // 7️⃣ Generera Word-fil
    const buf = doc.getZip().generate({ type: "nodebuffer" });

    // 8️⃣ Skicka som nedladdning
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fulltNamn.replace(/\s+/g, "_")}.docx"`
    );

    res.end(buf);
    console.log("✅ Word-dokument genererat och skickat!");
    console.log("===========================================");
  } catch (err) {
    console.error("💥 Oväntat fel vid export:", err);
    res.status(500).json({ error: "Kunde inte skapa Word-dokument" });
  }
});

module.exports = router;
