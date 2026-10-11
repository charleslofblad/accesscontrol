const service = require('../services/mandateService');

exports.getAll = async (req, res, next) => {
  try {
    res.json(await service.getAll());
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const mandate = await service.getById(req.params.id);

    if (!mandate) {
      return res.status(404).json({
        message: 'Mandate ej hittat'
      });
    }

    res.json(mandate);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const mandate = await service.create(req.body);
    res.status(201).json(mandate);
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
    res.json({ message: 'Mandate raderat' });
  } catch (err) {
    next(err);
  }
};