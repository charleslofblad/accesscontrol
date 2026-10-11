// app_api/services/identityService.js
const { Identity } = require('../models');

exports.getAll = async () => {
  return Identity.find();
};

exports.getById = async (id) => {
  return Identity.findById(id);
};

exports.create = async (data) => {
  const identity = new Identity(data);
  return identity.save();
};

exports.update = async (id, data) => {
  const updated = await Identity.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  );

  if (!updated) {
    throw Object.assign(
      new Error('Identity ej hittad'),
      { status: 404 }
    );
  }

  return updated;
};

exports.remove = async (id) => {
  return Identity.findByIdAndDelete(id);
};