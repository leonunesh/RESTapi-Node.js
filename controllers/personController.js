const PersonModel = require('../models/PersonModel');

exports.getPeople = async (req, res) => {
  const data = await PersonModel.find();
  res.status(200).json({ status: 'success', data });
};

exports.getPersonById = async (req, res) => {
  const data = await PersonModel.findById(req.params.id);

  if (!data) {
    return res.status(404).json({ status: 'fail', message: 'Person not found' });
  }

  res.status(200).json({ status: 'success', data });
};

exports.createPerson = async (req, res) => {
  const newPerson = await PersonModel.create(req.body);
  res.status(201).json({ status: 'success', data: newPerson });
};

exports.updatePerson = async (req, res) => {
  const updatedPerson = await PersonModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  if (!updatedPerson) {
    return res.status(404).json({ status: 'fail', message: 'Person not found' });
  }

  res.status(200).json({ status: 'success', data: updatedPerson });
};

exports.deletePerson = async (req, res) => {
  const deletedPerson = await PersonModel.findByIdAndDelete(req.params.id);

  if (!deletedPerson) {
    return res.status(404).json({ status: 'fail', message: 'Person not found' });
  }

  res.status(200).json({ status: 'success', data: deletedPerson });
};
