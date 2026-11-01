const Attendance = require('../models/Attendance');

const getAttendance = async (req, res) => {
  try {
    const records = await Attendance.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const markAttendance = async (req, res) => {
  try {
    const record = await Attendance.create({ ...req.body, user: req.user.id });
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAttendance, markAttendance };