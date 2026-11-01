const express = require('express');
const router = express.Router();
const { getTrainings, createTraining, deleteTraining } = require('../controllers/trainingController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getTrainings);
router.post('/', protect, createTraining);
router.delete('/:id', protect, deleteTraining);

module.exports = router;