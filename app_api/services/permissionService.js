
const { Permission } = require('../models');

exports.getAll = async () => {
  return Permission.find();
};

exports.getById = async (id) => {
  return Permission.findById(id);
};

exports.create = async (data) => {
  const permission = new Permission(data);
  return permission.save();
};

exports.update = async (id, data) => {
  const updated = await Permission.findByIdAndUpdate(
    id,
    { $set: data },
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  );

  if (!updated) {
    throw Object.assign(
      new Error('Permission ej hittad'),
      { status: 404 }
    );
  }

  return updated;
};

exports.remove = async (id) => {
  return Permission.findByIdAndDelete(id);
};