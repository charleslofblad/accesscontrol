// app_api/services/anstalldService.js
const { Anstalld } = require('../models');

const buildSearchQuery = (term) => {
  const regex = new RegExp(term, 'i');
  const textQuery = [
    { Efternamn: { $regex: regex } },
    { Fornamn: { $regex: regex } },
    { Personnummer: { $regex: regex } },
    { Roll: { $regex: regex } },
    { Chef: { $regex: regex } }
  ];

  const numericQuery = [
    { $expr: { $regexMatch: { input: { $toString: "$Tjanstekort.EM_kod" }, regex } } },
    { $expr: { $regexMatch: { input: { $toString: "$Tjanstekort.Mifare_kod" }, regex } } },
    { $expr: { $regexMatch: { input: { $toString: "$Tjanstekort.RCO" }, regex } } }
  ];

  return { $or: [...textQuery, ...numericQuery] };
};

exports.getPaginated = async ({ skip = 0, limit = 100 }) => {
  const [anstallda, total] = await Promise.all([
    Anstalld.find().skip(skip).limit(limit),
    Anstalld.countDocuments()
  ]);
  return { anstallda, total };
};

exports.searchPaginated = async ({ search = '', skip = 0, limit = 100 }) => {
  const query = search ? buildSearchQuery(search) : {};
  const [anstallda, total] = await Promise.all([
    Anstalld.find(query).skip(skip).limit(limit),
    Anstalld.countDocuments(query)
  ]);
  return { anstallda, total };
};

exports.getAll = async () => Anstalld.find();

exports.getById = async (id) => {
  if (Anstalld.db && Anstalld.db instanceof Object && require('mongoose').Types.ObjectId.isValid(id)) {
    return Anstalld.findById(id);
  }
  return Anstalld.findOne({ _id: id });
};

exports.create = async (data) => {
  const a = new Anstalld(data);
  return a.save();
};
/* gammal update version
exports.update = async (id, payload) => {
  const anstalld = await Anstalld.findById(id);
  if (!anstalld) throw Object.assign(new Error('Anställd ej hittad'), { status: 404 });

  // uppdatera fält utanför Tjanstekort
  Object.keys(payload).forEach(key => {
    if (key !== 'Tjanstekort') anstalld[key] = payload[key];
  });

  if (payload.Tjanstekort) {
    if (!anstalld.Tjanstekort) anstalld.Tjanstekort = {};
    Object.keys(payload.Tjanstekort).forEach(k => {
      anstalld.Tjanstekort[k] = payload.Tjanstekort[k];
    });
  }

  return anstalld.save();
};
*/

// nya versionen
exports.update = async (id, payload) => {
  try {

    const updateData = { ...payload };

    // 🔧 hantera nested objekt (Tjanstekort)
    if (payload.Tjanstekort) {
      Object.keys(payload.Tjanstekort).forEach(key => {
        updateData[`Tjanstekort.${key}`] = payload.Tjanstekort[key];
      });
      delete updateData.Tjanstekort;
    }

    const updated = await Anstalld.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updated) {
      throw Object.assign(new Error('Anställd ej hittad'), { status: 404 });
    }

    return updated;

  } catch (err) {
    console.error('❌ Update error:', err);
    throw err;
  }
};

exports.remove = async (id) => Anstalld.findByIdAndDelete(id);
