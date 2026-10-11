// app_api/controllers/identityController.js
const service = require('../services/identityService');

exports.getAll = async (req, res, next) => {
  try {
    res.json(await service.getAll());
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const identity = await service.getById(req.params.id);

    if (!identity) {
      return res.status(404).json({
        message: 'Identity ej hittad'
      });
    }

    res.json(identity);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const identity = await service.create(req.body);
    res.status(201).json(identity);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    res.json(
      await service.update(req.params.id, req.body)
    );
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    await service.remove(req.params.id);
    res.json({ message: 'Identity raderad' });
  } catch (err) {
    next(err);
  }
};