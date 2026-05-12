// app_api/models/Anstalld.js
const mongoose = require('mongoose');
const Counter = require('./Counter');

const TjanstekortSchema = new mongoose.Schema({
  Tjanstekort_ID: Number,
  Datum: Number,
  EM_kod: Number,
  Mifare_kod: Number,
  Alliera_Bla: String,
  Alliera_Gron: String,
  RCO: Number
}, { _id: false });

const AnstalldSchema = new mongoose.Schema({
  Anstallda_ID: { type: Number, unique: true },
  Fullt_namn: String,
  Efternamn: String,
  Fornamn: String,
  Personnummer: String,
  Roll: String,
  Chef: String,
  Layout: String,
  Foretag: String,
  Reff_Pnr: String,
// ny
  faceDescriptors: {
  type: [[Number]], // Array av arrayer (Float32Array → number[])
  default: []
},
// NY END

  Tjanstekort: { type: TjanstekortSchema, default: {} }
}, { timestamps: true });

// Pre-save counter hook
AnstalldSchema.pre('save', async function (next) {
  if (this.isNew && !this.Anstallda_ID) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { name: 'anstallda' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.Anstallda_ID = counter.seq;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model('Anstalld', AnstalldSchema);
