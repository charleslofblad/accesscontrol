
const service = require('../services/permissionService');

exports.getAll = async (req, res, next) => {
  try {
    res.json(await service.getAll());
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const permission = await service.getById(req.params.id);

    if (!permission) {
      return res.status(404).json({
        message: 'Permission ej hittad'
      });
    }

    res.json(permission);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const permission = await service.create(req.body);
    res.status(201).json(permission);
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
    res.json({ message: 'Permission raderad' });
  } catch (err) {
    next(err);
  }
};