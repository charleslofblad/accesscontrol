
const { Policy } = require('../models');

exports.getAll = async () => {
  return Policy.find().populate('permissions');
};

exports.getById = async (id) => {
  return Policy.findById(id).populate('permissions');
};

exports.create = async (data) => {
  const policy = new Policy(data);
  return policy.save();
};

exports.update = async (id, data) => {
  const updated = await Policy.findByIdAndUpdate(
    id,
    { $set: data },
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  ).populate('permissions');

  if (!updated) {
    throw Object.assign(
      new Error('Policy ej hittat'),
      { status: 404 }
    );
  }

  return updated;
};

exports.remove = async (id) => {
  return Policy.findByIdAndDelete(id);
};