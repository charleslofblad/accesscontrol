const { Role } = require('../models');

exports.getAll = async () => {
  return Role.find();
};

exports.getById = async (id) => {
  return Role.findById(id);
};

exports.create = async (data) => {
  const role = new Role(data);
  return role.save();
};

exports.update = async (id, data) => {
  const updated = await Role.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  );

  if (!updated) {
    throw Object.assign(
      new Error('Role ej hittad'),
      { status: 404 }
    );
  }

  return updated;
};

exports.remove = async (id) => {
  return Role.findByIdAndDelete(id);
};