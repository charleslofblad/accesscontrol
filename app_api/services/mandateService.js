const { Mandate } = require('../models');

exports.getAll = async () => {
  return Mandate.find()
    .populate('identityId')
    .populate('roleId');
};

exports.getById = async (id) => {
  return Mandate.findById(id)
    .populate('identityId')
    .populate('roleId');
};

exports.create = async (data) => {
  const mandate = new Mandate(data);
  return mandate.save();
};


exports.update = async (id, data) => {
  const updated = await Mandate.findByIdAndUpdate(
    id,
    { $set: data },
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  )
    .populate('identityId')
    .populate('roleId')
    .populate('policies');

  if (!updated) {
    throw Object.assign(
      new Error('Mandate ej hittat'),
      { status: 404 }
    );
  }

  return updated;
};

exports.remove = async (id) => {
  return Mandate.findByIdAndDelete(id);
};