const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, employeeController.getEmployees);
router.post('/', protect, employeeController.createEmployee);
router.put('/:id', protect, employeeController.updateEmployee);
router.delete('/:id', protect, employeeController.deleteEmployee);

module.exports = router;