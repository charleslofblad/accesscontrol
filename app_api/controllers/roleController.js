
const service = require('../services/roleService');

exports.getAll = async (req, res, next) => {
  try {
    res.json(await service.getAll());
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const role = await service.getById(req.params.id);

    if (!role) {
      return res.status(404).json({
        message: 'Role ej hittad'
      });
    }

    res.json(role);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const role = await service.create(req.body);
    res.status(201).json(role);
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
    res.json({ message: 'Role raderad' });
  } catch (err) {
    next(err);
  }
};