const LeaveRequest = require('../models/LeaveRequest');

const getLeaves = async (req, res) => {
  try {
    const leaves = await LeaveRequest.find();
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.create({ ...req.body, user: req.user.id });
    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateLeaveStatus = async (req, res) => {
  try {
    const { status, reviewedBy } = req.body;
    const leave = await LeaveRequest.findByIdAndUpdate(
      req.params.id, 
      { status, reviewedBy: reviewedBy || 'HR/Manager' }, 
      { new: true }
    );
    res.json(leave);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getLeaves, createLeave, updateLeaveStatus };