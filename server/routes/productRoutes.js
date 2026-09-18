const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/', authenticateUser, authorizeRoles('ADMIN'), createProduct);
router.put('/:id', authenticateUser, authorizeRoles('ADMIN'), updateProduct);
router.delete('/:id', authenticateUser, authorizeRoles('ADMIN'), deleteProduct);

module.exports = router;
