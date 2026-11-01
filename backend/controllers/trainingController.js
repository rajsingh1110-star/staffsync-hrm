const TrainingProgram = require('../models/TrainingProgram');

const getTrainings = async (req, res) => {
  try {
    const trainings = await TrainingProgram.find();
    res.json(trainings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createTraining = async (req, res) => {
  try {
    const training = await TrainingProgram.create(req.body);
    res.status(201).json(training);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTraining = async (req, res) => {
  try {
    await TrainingProgram.findByIdAndDelete(req.params.id);
    res.json({ message: 'Training deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getTrainings, createTraining, deleteTraining };