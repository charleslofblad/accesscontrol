const service = require('../services/policyService');

exports.getAll = async (req, res, next) => {
  try {
    res.json(await service.getAll());
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const policy = await service.getById(req.params.id);

    if (!policy) {
      return res.status(404).json({
        message: 'Policy ej hittad'
      });
    }

    res.json(policy);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const policy = await service.create(req.body);
    res.status(201).json(policy);
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
    res.json({ message: 'Policy raderad' });
  } catch (err) {
    next(err);
  }
};