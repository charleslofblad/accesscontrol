// app_api/controllers/anstalldController.js
const service = require('../services/anstalldService');

exports.createLayout = async (req, res, next) => {
  // This controller originally existed in routes as layout endpoints -- kept here for completeness
  next();
};

exports.getLayouts = async (req, res, next) => {
  // handled elsewhere if needed
  next();
};

// Pagination + search controllers
exports.getPaginated = async (req, res, next) => {
  try {
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 100;
    const result = await service.getPaginated({ skip, limit });
    res.json(result);
  } catch (err) { next(err); }
};

exports.searchPaginated = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const skip = parseInt(req.query.skip) || 0;
    const limit = parseInt(req.query.limit) || 100;
    const result = await service.searchPaginated({ search, skip, limit });
    res.json(result);
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    const data = await service.getAll();
    res.json(data);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const doc = await service.getById(id);
    if (!doc) return res.status(404).json({ message: 'Anställd ej hittad' });
    res.json(doc);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const created = await service.create(req.body);
    res.status(201).json(created);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await service.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    res.json({ message: 'Anställd raderad' });
  } catch (err) { next(err); }
};
