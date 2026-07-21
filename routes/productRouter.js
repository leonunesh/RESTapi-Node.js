const express = require('express');
const productController = require('../controllers/productController');
const asyncHandler = require('../middleware/asyncHandler');
const protect = require('../middleware/protect');

const router = express.Router();

router.get('/', protect, asyncHandler(productController.getProducts));
router.get('/:id', protect, asyncHandler(productController.getProductById));
router.post('/', protect, asyncHandler(productController.createProduct));
router.put('/:id', protect, asyncHandler(productController.updateProduct));
router.delete('/:id', protect, asyncHandler(productController.deleteProduct));

module.exports = router;
