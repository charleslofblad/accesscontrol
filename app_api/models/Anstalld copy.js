const mongoose = require('mongoose');

const TjanstekortSchema = new mongoose.Schema({
    Tjanstekort_ID: Number,
    Datum: Number,
    EM_kod: Number,
    Mifare_kod: Number,
    Alliera_Bla: String,
    Alliera_Gron: String,
    RCO: Number
});

const AnstalldSchema = new mongoose.Schema({
    Anstallda_ID: Number,
    Fullt_namn: String,
    Efternamn: String,
    Fornamn: String,
    Personnummer: String,
    Roll: String,
    Chef: String,
    Layout: String,
    Foretag: String,
    Reff_Pnr: String,
    Tjanstekort: TjanstekortSchema
});


module.exports = mongoose.model('Anstalld', AnstalldSchema);

/*
const mongoose = require('mongoose');

const TjanstekortSchema = new mongoose.Schema({
    Tjanstekort_ID: Number,
    Datum: Number,
    EM_kod: Number,
    Mifare_kod: Number,
    Alliera_Bla: String,
    Alliera_Gron: String,
    RCO: Number
});

const AnstalldSchema = new mongoose.Schema({
    Anstallda_ID: Number,
    Fullt_namn: String,
    Efternamn: String,
    Fornamn: String,
    Personnummer: String,
    Roll: String,
    Chef: String,
    Layout: String,
    Foretag: String,
    Reff_Pnr: String,
    Tjanstekort: TjanstekortSchema
});

// Registrera Anstalld-modellen
mongoose.model('Anstalld', AnstalldSchema);

// Lägg LayoutSchema i samma fil eller skapa en ny fil, men registrera separat:
const LayoutSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },  // t.ex. "Standard", "SJ"…
  data: { type: mongoose.Schema.Types.Mixed, default: {} } // ditt canvas‑JSON
});

// Registrera Layout-modellen
mongoose.model('Layout', LayoutSchema);

// Sedan exporterar du bara Anstalld (eller båda om du vill)
module.exports = {
  Anstalld: mongoose.model('Anstalld'),
  Layout: mongoose.model('Layout')
};

*/