const express = require('express');
const personController = require('../controllers/personController');
const asyncHandler = require('../middleware/asyncHandler');
const protect = require('../middleware/protect');

const router = express.Router();

router.get('/', protect, asyncHandler(personController.getPeople));
router.get('/:id', protect, asyncHandler(personController.getPersonById));
router.post('/', protect, asyncHandler(personController.createPerson));
router.put('/:id', protect, asyncHandler(personController.updatePerson));
router.delete('/:id', protect, asyncHandler(personController.deletePerson));

module.exports = router;
